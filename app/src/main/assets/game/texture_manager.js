// Asynchronous Texture Manager & Mipmapping Engine for KADAYA: THE LAST SHADOW
// Manages asynchronous procedural texture generation, GPU mipmapping, anisotropic filtering,
// and off-screen texture warmup to prevent frame drops during intense combat scenes.
// Built for Three.js (r128)

class TextureManager {
    constructor() {
        this.cache = new Map();
        this.placeholders = new Map();
        this.queue = [];
        this.isProcessing = false;
        this.renderer = null;
        this.maxAnisotropy = 4;

        // Frame budget for async generation (max 4.0ms per tick to maintain 60 FPS / 16.6ms target)
        this.frameBudgetMs = 4.0;

        // Metrics
        this.totalQueued = 0;
        this.loadedCount = 0;
        this.warmedCount = 0;

        // Listeners
        this.onProgressCallbacks = [];
        this.onCompleteCallbacks = [];
    }

    setRenderer(renderer) {
        this.renderer = renderer;
        if (renderer && renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
            this.maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        }

        // Apply anisotropy and warmup any textures already in cache
        this.cache.forEach((tex, key) => {
            this.configureTextureMipmapping(tex);
            this.warmupTexture(tex);
        });
    }

    // Configure high-quality GPU mipmapping and anisotropic filtering
    configureTextureMipmapping(texture, options = {}) {
        if (!texture) return;

        // Ensure power of 2 mipmap generation
        texture.generateMipmaps = options.generateMipmaps !== false;

        // Trilinear filtering: LinearMipmapLinearFilter eliminates distant aliasing and texture shimmering
        texture.minFilter = options.minFilter || THREE.LinearMipmapLinearFilter;
        texture.magFilter = options.magFilter || THREE.LinearFilter;

        // Anisotropic filtering sharpens textures viewed at steep grazing angles (ground, walls)
        if (this.maxAnisotropy > 1) {
            texture.anisotropy = options.anisotropy || this.maxAnisotropy;
        }

        if (options.wrapS) texture.wrapS = options.wrapS;
        if (options.wrapT) texture.wrapT = options.wrapT;
        if (options.repeat) {
            if (Array.isArray(options.repeat)) {
                texture.repeat.set(options.repeat[0], options.repeat[1]);
            } else if (typeof options.repeat === 'object' && options.repeat.x !== undefined) {
                texture.repeat.copy(options.repeat);
            }
        }

        texture.needsUpdate = true;
    }

    // Force WebGL to immediately upload texture bytes to GPU VRAM and compute mipmaps ahead of time
    warmupTexture(texture) {
        if (!this.renderer || !texture) return;
        try {
            texture.needsUpdate = true;
            const gl = this.renderer.getContext();
            if (gl && !gl.isContextLost() && typeof this.renderer.initTexture === 'function') {
                this.renderer.initTexture(texture);
                this.warmedCount++;
            }
        } catch (e) {
            // Silently fall back if WebGL context is temporarily busy
        }
    }

    // Warm up all cached environmental textures immediately
    warmupAll() {
        if (!this.renderer) return;
        let count = 0;
        this.cache.forEach(texture => {
            this.warmupTexture(texture);
            count++;
        });
        return count;
    }

    // Creates an instant 16x16 lightweight placeholder canvas texture so materials can render immediately
    createPlaceholderTexture(key, fallbackHex = '#21252B') {
        if (this.placeholders.has(key)) {
            return this.placeholders.get(key);
        }

        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = fallbackHex;
        ctx.fillRect(0, 0, 16, 16);

        const tex = new THREE.CanvasTexture(canvas);
        tex.name = `placeholder_${key}`;
        this.configureTextureMipmapping(tex);

        this.placeholders.set(key, tex);
        return tex;
    }

    // Asynchronously queue or immediately retrieve a texture
    getOrLoad(key, generatorFn, options = {}) {
        // 1. If already fully generated in cache, return it
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        // 2. Create placeholder texture that will receive the real image data upon completion
        const placeholder = this.createPlaceholderTexture(key, options.fallbackColor || '#1A1C24');

        // Apply repeat/wrap configs to placeholder so layout matches immediately
        if (options.repeat) placeholder.repeat.set(...options.repeat);
        if (options.wrapS) placeholder.wrapS = options.wrapS;
        if (options.wrapT) placeholder.wrapT = options.wrapT;

        // 3. Queue task in priority order (high priority for active scene textures)
        this.queue.push({
            key,
            generatorFn,
            options,
            targetTexture: placeholder,
            priority: options.priority || 1
        });

        this.totalQueued++;

        // Start processing queue asynchronously
        if (!this.isProcessing) {
            this.startQueueProcessing();
        }

        return placeholder;
    }

    // Batch register multiple environmental textures
    registerBatch(configs) {
        configs.forEach(cfg => {
            this.getOrLoad(cfg.key, cfg.generatorFn, cfg.options);
        });
    }

    // Time-sliced non-blocking async queue processor
    startQueueProcessing() {
        this.isProcessing = true;

        const processTick = () => {
            if (this.queue.length === 0) {
                this.isProcessing = false;
                this.notifyComplete();
                return;
            }

            // Sort by priority (higher priority first)
            this.queue.sort((a, b) => b.priority - a.priority);

            const startTime = performance.now();

            // Process items within the frame budget (e.g. 4ms) to avoid dropping frames
            while (this.queue.length > 0 && (performance.now() - startTime) < this.frameBudgetMs) {
                const item = this.queue.shift();
                try {
                    const canvasResult = item.generatorFn();
                    if (canvasResult) {
                        const target = item.targetTexture;

                        // Swap underlying canvas image source
                        if (canvasResult instanceof HTMLCanvasElement) {
                            target.image = canvasResult;
                        } else if (canvasResult instanceof THREE.Texture) {
                            target.image = canvasResult.image;
                        }

                        // Configure mipmaps, trilinear filtering and anisotropy
                        this.configureTextureMipmapping(target, item.options);

                        // Warm up GPU buffer offscreen before high-intensity battle commences
                        if (this.renderer) {
                            this.warmupTexture(target);
                        }

                        this.cache.set(item.key, target);
                        this.loadedCount++;
                        this.notifyProgress(item.key, target);
                    }
                } catch (err) {
                    console.warn(`[TextureManager] Error generating texture ${item.key}:`, err);
                }
            }

            // Yield control back to browser to render frame smoothly, then continue next tick
            if (this.queue.length > 0) {
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(processTick, { timeout: 16 });
                } else {
                    setTimeout(processTick, 4);
                }
            } else {
                this.isProcessing = false;
                this.notifyComplete();
            }
        };

        setTimeout(processTick, 0);
    }

    notifyProgress(key, texture) {
        for (let i = 0; i < this.onProgressCallbacks.length; i++) {
            try {
                this.onProgressCallbacks[i](key, texture, this.loadedCount, this.totalQueued);
            } catch (e) {}
        }
    }

    notifyComplete() {
        for (let i = 0; i < this.onCompleteCallbacks.length; i++) {
            try {
                this.onCompleteCallbacks[i](this.loadedCount, this.warmedCount);
            } catch (e) {}
        }
    }

    onProgress(cb) {
        this.onProgressCallbacks.push(cb);
    }

    onComplete(cb) {
        this.onCompleteCallbacks.push(cb);
    }

    // Preload & warmup environmental textures for a specific map to eliminate in-game stalls
    preloadMapTextures(theme) {
        const priorityKeys = theme === 'forest' ? 
            ['stoneColor', 'stoneNormal', 'stoneRoughness', 'woodColor', 'woodNormal', 'sakuraPetal', 'grassTuft'] :
            (theme === 'graveyard' ? 
            ['stoneColor', 'stoneNormal', 'stoneRoughness', 'woodColor', 'woodNormal', 'smokeCloud'] :
            ['basaltColor', 'basaltNormal', 'lavaEmission', 'stoneColor', 'stoneNormal']);

        // Elevate priority of active map textures
        this.queue.forEach(item => {
            if (priorityKeys.includes(item.key)) {
                item.priority = 10;
            }
        });

        if (!this.isProcessing && this.queue.length > 0) {
            this.startQueueProcessing();
        }
    }

    // Clean up textures when no longer needed
    dispose(key) {
        if (this.cache.has(key)) {
            const tex = this.cache.get(key);
            tex.dispose();
            this.cache.delete(key);
        }
    }

    // Get stats for telemetry or HUD
    getStats() {
        return {
            cached: this.cache.size,
            queued: this.queue.length,
            loaded: this.loadedCount,
            warmed: this.warmedCount,
            anisotropy: this.maxAnisotropy,
            isProcessing: this.isProcessing
        };
    }
}

// Global Singleton Instance
window.textureManager = new TextureManager();
