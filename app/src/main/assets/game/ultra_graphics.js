// Ultra Graphics Engine for KADAYA: THE LAST SHADOW
// Provides AAA Procedural Textures, Normal Maps, Celestial Skybox, 3D Foliage, Volumetrics, and Post-FX
// Built for Three.js (r128)

class UltraGraphicsEngine {
    constructor() {
        this.textures = {};
        this.materials = {};
        this.grassClusters = [];
        this.ambientParticles = [];
        this.flickerLights = [];
        this.windTime = 0;
        this.preset = 'ULTRA'; // 'ULTRA', 'HIGH', 'MEDIUM'

        this.initProceduralTextures();
    }

    // ==========================================
    // PROCEDURAL PBR TEXTURES & NORMAL MAP GENERATORS
    // ==========================================
    initProceduralTextures() {
        const tm = window.textureManager;
        if (tm) {
            this.textures.stoneColor = tm.getOrLoad('stoneColor', () => this.generateCobblestoneColor(512, 512), {
                fallbackColor: '#20242C',
                repeat: [4, 16],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 10
            });
            this.textures.stoneNormal = tm.getOrLoad('stoneNormal', () => this.generateCobblestoneNormal(512, 512), {
                fallbackColor: '#8080FF',
                repeat: [4, 16],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 9
            });
            this.textures.stoneRoughness = tm.getOrLoad('stoneRoughness', () => this.generateCobblestoneRoughness(512, 512), {
                fallbackColor: '#AAAAAA',
                repeat: [4, 16],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 8
            });
            this.textures.woodColor = tm.getOrLoad('woodColor', () => this.generateWoodColor(512, 512), {
                fallbackColor: '#2A1810',
                repeat: [2, 4],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 8
            });
            this.textures.woodNormal = tm.getOrLoad('woodNormal', () => this.generateWoodNormal(512, 512), {
                fallbackColor: '#8080FF',
                repeat: [2, 4],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 7
            });
            this.textures.clothNormal = tm.getOrLoad('clothNormal', () => this.generateClothNormal(256, 256), {
                fallbackColor: '#8080FF',
                repeat: [16, 16],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 9
            });
            this.textures.bladeDamascus = tm.getOrLoad('bladeDamascus', () => this.generateDamascusSteel(512, 128), {
                fallbackColor: '#E0E0E0',
                priority: 10
            });
            this.textures.goldFiligree = tm.getOrLoad('goldFiligree', () => this.generateGoldFiligree(256, 256), {
                fallbackColor: '#FFD700',
                priority: 7
            });
            this.textures.basaltColor = tm.getOrLoad('basaltColor', () => this.generateBasaltColor(512, 512), {
                fallbackColor: '#151318',
                repeat: [6, 6],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 6
            });
            this.textures.basaltNormal = tm.getOrLoad('basaltNormal', () => this.generateBasaltNormal(512, 512), {
                fallbackColor: '#8080FF',
                repeat: [6, 6],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 6
            });
            this.textures.lavaEmission = tm.getOrLoad('lavaEmission', () => this.generateLavaEmission(512, 512), {
                fallbackColor: '#FF3D00',
                repeat: [4, 4],
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                priority: 6
            });
            this.textures.moonTexture = tm.getOrLoad('moonTexture', () => this.generateMoonSurface(512, 512), {
                fallbackColor: '#E8EAF6',
                priority: 5
            });
            this.textures.sakuraPetal = tm.getOrLoad('sakuraPetal', () => this.generateSakuraPetalSprite(128, 128), {
                fallbackColor: '#F48FB1',
                priority: 7
            });
            this.textures.grassTuft = tm.getOrLoad('grassTuft', () => this.generateGrassTuftSprite(256, 256), {
                fallbackColor: '#2E7D32',
                priority: 8
            });
            this.textures.smokeCloud = tm.getOrLoad('smokeCloud', () => this.generateSmokeCloudSprite(256, 256), {
                fallbackColor: '#90CAF9',
                priority: 5
            });
            this.textures.sparkStar = tm.getOrLoad('sparkStar', () => this.generateSparkStarSprite(128, 128), {
                fallbackColor: '#E0F7FA',
                priority: 5
            });
        } else {
            this.textures.stoneColor = this.generateCobblestoneColor(512, 512);
            this.textures.stoneNormal = this.generateCobblestoneNormal(512, 512);
            this.textures.stoneRoughness = this.generateCobblestoneRoughness(512, 512);
            this.textures.woodColor = this.generateWoodColor(512, 512);
            this.textures.woodNormal = this.generateWoodNormal(512, 512);
            this.textures.clothNormal = this.generateClothNormal(256, 256);
            this.textures.bladeDamascus = this.generateDamascusSteel(512, 128);
            this.textures.goldFiligree = this.generateGoldFiligree(256, 256);
            this.textures.basaltColor = this.generateBasaltColor(512, 512);
            this.textures.basaltNormal = this.generateBasaltNormal(512, 512);
            this.textures.lavaEmission = this.generateLavaEmission(512, 512);
            this.textures.moonTexture = this.generateMoonSurface(512, 512);
            this.textures.sakuraPetal = this.generateSakuraPetalSprite(128, 128);
            this.textures.grassTuft = this.generateGrassTuftSprite(256, 256);
            this.textures.smokeCloud = this.generateSmokeCloudSprite(256, 256);
            this.textures.sparkStar = this.generateSparkStarSprite(128, 128);
        }
    }

    // 1. Cobblestone Texture with rounded stones, mortar lines & moss
    generateCobblestoneColor(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        // Base dark mortar
        ctx.fillStyle = '#181A22';
        ctx.fillRect(0, 0, w, h);

        const cols = 8;
        const rows = 16;
        const tileW = w / cols;
        const tileH = h / rows;

        for (let r = 0; r < rows; r++) {
            const rowOffset = (r % 2) * (tileW * 0.5);
            for (let col = -1; col <= cols; col++) {
                const cx = col * tileW + rowOffset + (tileW * 0.5);
                const cy = r * tileH + (tileH * 0.5);
                const rx = (tileW * 0.44) * (0.9 + Math.random() * 0.2);
                const ry = (tileH * 0.42) * (0.9 + Math.random() * 0.2);

                const grad = ctx.createRadialGradient(cx - rx * 0.2, cy - ry * 0.2, 2, cx, cy, rx);
                const baseTone = 48 + Math.floor(Math.random() * 24);
                grad.addColorStop(0, `rgb(${baseTone + 35}, ${baseTone + 40}, ${baseTone + 50})`);
                grad.addColorStop(0.7, `rgb(${baseTone + 15}, ${baseTone + 20}, ${baseTone + 28})`);
                grad.addColorStop(1, `rgb(${baseTone - 10}, ${baseTone - 8}, ${baseTone - 2})`);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.1, 0, Math.PI * 2);
                ctx.fill();

                // Surface micro-cracks
                if (Math.random() > 0.4) {
                    ctx.strokeStyle = 'rgba(12, 14, 20, 0.6)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(cx - rx * 0.5, cy);
                    ctx.lineTo(cx, cy + (Math.random() - 0.5) * ry * 0.6);
                    ctx.lineTo(cx + rx * 0.4, cy + (Math.random() - 0.5) * ry * 0.6);
                    ctx.stroke();
                }

                // Delicate moss on edges
                if (Math.random() > 0.5) {
                    ctx.fillStyle = 'rgba(28, 55, 32, 0.45)';
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + ry * 0.7, rx * 0.6, ry * 0.3, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 16);
        return tex;
    }

    // 2. Cobblestone Normal Map (Sobel filter over elevation)
    generateCobblestoneNormal(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        // Draw heightmap first
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        const cols = 8;
        const rows = 16;
        const tileW = w / cols;
        const tileH = h / rows;

        for (let r = 0; r < rows; r++) {
            const rowOffset = (r % 2) * (tileW * 0.5);
            for (let col = -1; col <= cols; col++) {
                const cx = col * tileW + rowOffset + (tileW * 0.5);
                const cy = r * tileH + (tileH * 0.5);
                const rx = tileW * 0.44;
                const ry = tileH * 0.42;

                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
                grad.addColorStop(0, '#FFFFFF');
                grad.addColorStop(0.7, '#888888');
                grad.addColorStop(1, '#000000');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const normalData = ctx.createImageData(w, h);
        const nd = normalData.data;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                const x0 = ((x - 1 + w) % w);
                const x1 = ((x + 1) % w);
                const y0 = ((y - 1 + h) % h);
                const y1 = ((y + 1) % h);

                const left = data[(y * w + x0) * 4];
                const right = data[(y * w + x1) * 4];
                const up = data[(y0 * w + x) * 4];
                const down = data[(y1 * w + x) * 4];

                const dx = (left - right) / 255.0;
                const dy = (up - down) / 255.0;
                const dz = 0.5;

                const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const nx = (dx / len) * 0.5 + 0.5;
                const ny = (dy / len) * 0.5 + 0.5;
                const nz = (dz / len) * 0.5 + 0.5;

                nd[idx] = Math.floor(nx * 255);
                nd[idx + 1] = Math.floor(ny * 255);
                nd[idx + 2] = Math.floor(nz * 255);
                nd[idx + 3] = 255;
            }
        }
        ctx.putImageData(normalData, 0, 0);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 16);
        return tex;
    }

    // 3. Cobblestone Roughness Map
    generateCobblestoneRoughness(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(0, 0, w, h);

        // Add specular variation (shiny wet spots)
        for (let i = 0; i < 400; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = 4 + Math.random() * 20;
            ctx.fillStyle = Math.random() > 0.4 ? 'rgba(40, 40, 40, 0.4)' : 'rgba(230, 230, 230, 0.3)';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 16);
        return tex;
    }

    // 4. Japanese Cedar / Cypress Wood Texture
    generateWoodColor(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#2A1810';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < h; i += 2) {
            const tone = 30 + Math.sin(i * 0.1) * 12 + (Math.random() - 0.5) * 8;
            ctx.fillStyle = `rgb(${tone + 25}, ${tone + 10}, ${tone})`;
            ctx.fillRect(0, i, w, 2);
        }

        // Grain knots
        for (let k = 0; k < 6; k++) {
            const kx = Math.random() * w;
            const ky = Math.random() * h;
            for (let ring = 1; ring < 25; ring += 3) {
                ctx.strokeStyle = 'rgba(20, 10, 5, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(kx, ky, ring * 1.5, ring * 0.8, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 4);
        return tex;
    }

    // 5. Wood Normal Map
    generateWoodNormal(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#8080FF';
        ctx.fillRect(0, 0, w, h);

        for (let y = 0; y < h; y += 3) {
            const ny = Math.floor(128 + Math.sin(y * 0.25) * 35);
            ctx.fillStyle = `rgb(128, ${ny}, 255)`;
            ctx.fillRect(0, y, w, 2);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 4);
        return tex;
    }

    // 6. Cloth Weave Normal Map
    generateClothNormal(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#8080FF';
        ctx.fillRect(0, 0, w, h);

        for (let y = 0; y < h; y += 4) {
            for (let x = 0; x < w; x += 4) {
                const isCross = ((x / 4) + (y / 4)) % 2 === 0;
                ctx.fillStyle = isCross ? 'rgb(145, 120, 240)' : 'rgb(115, 138, 255)';
                ctx.fillRect(x, y, 4, 4);
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(16, 16);
        return tex;
    }

    // 7. Folded Damascus Steel Katana Texture with Hamon wave and golden Kanji
    generateDamascusSteel(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        // High polish steel gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(0.35, '#B0BEC5');
        bgGrad.addColorStop(0.75, '#455A64');
        bgGrad.addColorStop(1, '#263238');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Damascus wave ripples
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 6) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            for (let y = 0; y < h; y += 4) {
                const wave = Math.sin(y * 0.15 + x * 0.05) * 4;
                ctx.lineTo(x + wave, y);
            }
            ctx.stroke();
        }

        // Hamon temper wave along the edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const hamonY = (h * 0.72) + Math.sin(x * 0.08) * 6 + Math.cos(x * 0.2) * 3;
            if (x === 0) ctx.moveTo(x, hamonY);
            else ctx.lineTo(x, hamonY);
        }
        ctx.stroke();

        // Inscribed Golden Kanji Runes
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px serif';
        ctx.shadowColor = '#FF8F00';
        ctx.shadowBlur = 4;
        ctx.fillText('影', w * 0.35, h * 0.45);
        ctx.fillText('刃', w * 0.48, h * 0.45);
        ctx.fillText('神', w * 0.61, h * 0.45);

        return new THREE.CanvasTexture(c);
    }

    // 8. Gold Filigree Trim Texture
    generateGoldFiligree(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#1A1814';
        ctx.fillRect(0, 0, w, h);

        // Gold swirl filigree
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FF8F00';
        ctx.shadowBlur = 6;

        for (let y = 20; y < h; y += 40) {
            ctx.beginPath();
            for (let x = 0; x < w; x += 10) {
                const cy = y + Math.sin(x * 0.1) * 12;
                if (x === 0) ctx.moveTo(x, cy);
                else ctx.lineTo(x, cy);
            }
            ctx.stroke();
        }

        return new THREE.CanvasTexture(c);
    }

    // 9. Volcanic Basalt Texture & Emission for Temple
    generateBasaltColor(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#151318';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const shade = 18 + Math.floor(Math.random() * 20);
            ctx.fillStyle = `rgb(${shade + 5}, ${shade}, ${shade + 3})`;
            ctx.fillRect(x, y, 2 + Math.random() * 4, 2 + Math.random() * 4);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(6, 6);
        return tex;
    }

    generateBasaltNormal(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#8080FF';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 1500; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const nx = 110 + Math.floor(Math.random() * 36);
            const ny = 110 + Math.floor(Math.random() * 36);
            ctx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
            ctx.fillRect(x, y, 3, 3);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(6, 6);
        return tex;
    }

    generateLavaEmission(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        // Glowing molten fissures
        ctx.strokeStyle = '#FF3D00';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#FFEA00';
        ctx.shadowBlur = 10;

        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            let curX = Math.random() * w;
            let curY = 0;
            ctx.moveTo(curX, curY);
            while (curY < h) {
                curX += (Math.random() - 0.5) * 40;
                curY += 20 + Math.random() * 30;
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();
        }

        // Core bright yellow veins
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 2;
        ctx.stroke();

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 4);
        return tex;
    }

    // 10. Moon Texture with Craters & Luminous Maria
    generateMoonSurface(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        // Pearlescent base
        ctx.fillStyle = '#E8EAF6';
        ctx.fillRect(0, 0, w, h);

        // Lunar Maria (dark basalt plains)
        ctx.fillStyle = 'rgba(92, 107, 115, 0.45)';
        for (let m = 0; m < 7; m++) {
            ctx.beginPath();
            ctx.arc(w * (0.2 + Math.random() * 0.6), h * (0.2 + Math.random() * 0.6), w * (0.12 + Math.random() * 0.22), 0, Math.PI * 2);
            ctx.fill();
        }

        // Craters with bright rims and shadows
        for (let i = 0; i < 45; i++) {
            const cx = Math.random() * w;
            const cy = Math.random() * h;
            const r = 4 + Math.random() * 22;

            ctx.fillStyle = 'rgba(40, 50, 60, 0.6)';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();

            // Highlight rim
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx - r * 0.2, cy - r * 0.2, r, Math.PI * 0.8, Math.PI * 1.8);
            ctx.stroke();
        }

        return new THREE.CanvasTexture(c);
    }

    // 11. Sakura Petal Sprite
    generateSakuraPetalSprite(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        const grad = ctx.createRadialGradient(w * 0.45, h * 0.35, 2, w * 0.5, h * 0.5, w * 0.45);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.35, '#F48FB1');
        grad.addColorStop(0.85, '#E91E63');
        grad.addColorStop(1, 'rgba(233, 30, 99, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Heart-shaped petal curve
        ctx.moveTo(w * 0.5, h * 0.2);
        ctx.bezierCurveTo(w * 0.2, 0, 0, h * 0.5, w * 0.5, h * 0.9);
        ctx.bezierCurveTo(w, h * 0.5, w * 0.8, 0, w * 0.5, h * 0.2);
        ctx.fill();

        return new THREE.CanvasTexture(c);
    }

    // 12. Grass Tuft Sprite
    generateGrassTuftSprite(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        ctx.clearRect(0, 0, w, h);

        const blades = 12;
        for (let i = 0; i < blades; i++) {
            const bx = (w * 0.2) + (i / blades) * (w * 0.6);
            const bHeight = h * (0.6 + Math.random() * 0.35);
            const curve = (Math.random() - 0.5) * 35;

            const grad = ctx.createLinearGradient(bx, h, bx + curve, h - bHeight);
            grad.addColorStop(0, '#0D2B14');
            grad.addColorStop(0.5, '#2E7D32');
            grad.addColorStop(1, '#A5D6A7');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 3 + Math.random() * 2;
            ctx.beginPath();
            ctx.moveTo(bx, h);
            ctx.quadraticCurveTo(bx + curve * 0.5, h - bHeight * 0.6, bx + curve, h - bHeight);
            ctx.stroke();
        }

        return new THREE.CanvasTexture(c);
    }

    // 13. Volumetric Smoke/Cloud Sprite
    generateSmokeCloudSprite(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.5);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        grad.addColorStop(0.4, 'rgba(200, 220, 240, 0.35)');
        grad.addColorStop(0.8, 'rgba(150, 180, 220, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, w * 0.48, 0, Math.PI * 2);
        ctx.fill();

        return new THREE.CanvasTexture(c);
    }

    // 14. Spark Star Sprite
    generateSparkStarSprite(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');

        const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.5);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.2, '#00E5FF');
        grad.addColorStop(0.6, 'rgba(0, 229, 255, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, w * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // 4-point cross star flare
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(w * 0.48, 0, w * 0.04, h);
        ctx.fillRect(0, h * 0.48, w, h * 0.04);

        return new THREE.CanvasTexture(c);
    }

    // ==========================================
    // ULTRA CEL-SHADING & FRESNEL RIM LIGHT HELPER
    // ==========================================
    applyFresnelRimToMesh(mesh, rimColorHex = 0x00E5FF, rimPower = 2.5) {
        mesh.traverse(child => {
            if (child.isMesh && child.material) {
                // Ensure material reacts dynamically to scene lights and gives rim sheen
                if (child.material.isMeshStandardMaterial) {
                    child.material.roughness = Math.min(child.material.roughness, 0.7);
                    child.material.metalness = Math.max(child.material.metalness, 0.15);
                    // Add subtle emissive tint for vibrant dark fantasy anime pop
                    child.material.emissive = new THREE.Color(rimColorHex);
                    child.material.emissiveIntensity = 0.12;
                }
            }
        });
    }

    // ==========================================
    // 3D CELESTIAL SKYBOX & MOUNTAIN HORIZON
    // ==========================================
    buildUltraCelestialSky(scene, theme, mapConfig) {
        const group = new THREE.Group();
        group.name = "ultra_celestial_sky";

        // 1. Gigantic Celestial Moon
        const moonRadius = theme === 'forest' ? 18 : 22;
        const moonColor = theme === 'forest' ? 0xFF8A80 : (theme === 'graveyard' ? 0x84FFFF : 0xFFAB91);
        const moonHaloColor = theme === 'forest' ? 0xE53935 : (theme === 'graveyard' ? 0x00E5FF : 0xFF5722);

        const moonMesh = new THREE.Mesh(
            new THREE.SphereGeometry(moonRadius, 32, 32),
            new THREE.MeshStandardMaterial({
                map: this.textures.moonTexture,
                color: moonColor,
                emissive: moonColor,
                emissiveIntensity: 0.65,
                roughness: 0.8
            })
        );
        moonMesh.position.set(0, 65, -160);
        group.add(moonMesh);

        // Moon Glow Corona Halo (Multi-layered billboard discs)
        [1.25, 1.6, 2.1].forEach((scale, i) => {
            const halo = new THREE.Mesh(
                new THREE.PlaneGeometry(moonRadius * 2.8 * scale, moonRadius * 2.8 * scale),
                new THREE.MeshBasicMaterial({
                    map: this.textures.smokeCloud,
                    color: moonHaloColor,
                    transparent: true,
                    opacity: 0.35 / (i + 1),
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                })
            );
            halo.position.copy(moonMesh.position);
            halo.position.z += 1 + i;
            group.add(halo);
        });

        // Celestial Orbiting Rune Ring around Moon
        const ringGeo = new THREE.RingGeometry(moonRadius * 1.35, moonRadius * 1.48, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: moonHaloColor,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const moonRing = new THREE.Mesh(ringGeo, ringMat);
        moonRing.position.copy(moonMesh.position);
        moonRing.rotation.x = Math.PI * 0.15;
        group.add(moonRing);
        this.moonRing = moonRing;

        // 2. 360-degree Jagged Mountain Ridge (Distant silhouettes with snowy peaks)
        const mountainSegments = 24;
        const mountainRadiusOuter = 210;
        const mountainRadiusInner = 160;

        for (let i = 0; i < mountainSegments; i++) {
            const angle = (i / mountainSegments) * Math.PI * 2;
            const nextAngle = ((i + 1) / mountainSegments) * Math.PI * 2;

            // Outer towering range
            const mHeight = 55 + Math.sin(i * 1.7) * 25 + Math.cos(i * 3.1) * 15;
            const mx = Math.sin(angle) * mountainRadiusOuter;
            const mz = Math.cos(angle) * mountainRadiusOuter;

            const cone = new THREE.Mesh(
                new THREE.ConeGeometry(38 + Math.random() * 15, mHeight, 5),
                new THREE.MeshStandardMaterial({
                    color: theme === 'forest' ? 0x0A0912 : (theme === 'graveyard' ? 0x060B12 : 0x140707),
                    roughness: 0.95,
                    metalness: 0.1
                })
            );
            cone.position.set(mx, mHeight * 0.45, mz);
            cone.rotation.y = Math.random() * Math.PI;
            group.add(cone);

            // Snowy apex cap on highest peaks
            if (mHeight > 60) {
                const snowCap = new THREE.Mesh(
                    new THREE.ConeGeometry(14, 18, 5),
                    new THREE.MeshStandardMaterial({ color: 0xDCE775, roughness: 0.8, emissive: 0x424242, emissiveIntensity: 0.1 })
                );
                snowCap.position.set(mx, mHeight * 0.85, mz);
                group.add(snowCap);
            }

            // Inner mid-ground foothills
            if (i % 2 === 0) {
                const hillHeight = 28 + Math.random() * 14;
                const hx = Math.sin(angle + 0.1) * mountainRadiusInner;
                const hz = Math.cos(angle + 0.1) * mountainRadiusInner;
                const hill = new THREE.Mesh(
                    new THREE.ConeGeometry(28, hillHeight, 4),
                    new THREE.MeshStandardMaterial({
                        color: theme === 'forest' ? 0x141020 : (theme === 'graveyard' ? 0x0C1522 : 0x220C0C),
                        roughness: 0.9
                    })
                );
                hill.position.set(hx, hillHeight * 0.45, hz);
                group.add(hill);
            }
        }

        // 3. Twinkling Night Stars (Instanced points)
        const starCount = 350;
        const starGeo = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * (Math.PI * 0.45); // Upper hemisphere
            const dist = 240;
            starPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
            starPositions[i * 3 + 1] = dist * Math.cos(phi) + 15;
            starPositions[i * 3 + 2] = dist * Math.sin(phi) * Math.sin(theta);
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const starMat = new THREE.PointsMaterial({
            size: 2.2,
            map: this.textures.sparkStar,
            transparent: true,
            blending: THREE.AdditiveBlending,
            color: 0xE0F7FA,
            depthWrite: false
        });
        const starField = new THREE.Points(starGeo, starMat);
        group.add(starField);

        scene.add(group);
        return group;
    }

    // ==========================================
    // 3D INSTANCED GRASS SYSTEM & WINDS
    // ==========================================
    buildUltraFoliageGrass(scene, count = 220, areaRadius = 38) {
        const group = new THREE.Group();
        group.name = "ultra_grass_field";
        this.grassClusters = [];

        const grassGeo = new THREE.PlaneGeometry(1.4, 1.2);
        grassGeo.translate(0, 0.6, 0);

        const grassMat = new THREE.MeshStandardMaterial({
            map: this.textures.grassTuft,
            transparent: true,
            alphaTest: 0.25,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.1
        });

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 3.5 + Math.random() * areaRadius;
            const x = Math.sin(angle) * dist;
            const z = Math.cos(angle) * dist;

            // Don't spawn on main center stone path
            if (Math.abs(x) < 2.6 && z > -36 && z < 20) continue;

            // Create crossed plane tuft for 3D fullness
            const tuft = new THREE.Group();
            tuft.position.set(x, 0, z);

            const p1 = new THREE.Mesh(grassGeo, grassMat);
            const p2 = new THREE.Mesh(grassGeo, grassMat);
            p2.rotation.y = Math.PI * 0.5;

            tuft.add(p1);
            tuft.add(p2);

            const s = 0.8 + Math.random() * 0.5;
            tuft.scale.set(s, s, s);
            tuft.rotation.y = Math.random() * Math.PI;

            group.add(tuft);
            this.grassClusters.push(tuft);
        }

        scene.add(group);
        return group;
    }

    // ==========================================
    // VOLUMETRIC GOD RAYS & GROUND MIST
    // ==========================================
    buildVolumetricAtmosphere(scene, theme) {
        const group = new THREE.Group();
        group.name = "ultra_volumetrics";

        const rayColor = theme === 'forest' ? 0xFFCDD2 : (theme === 'graveyard' ? 0x80DEEA : 0xFFCC80);

        // Angled Volumetric Light Shafts (God Rays through trees/torii)
        [-12, 0, 12].forEach((x, idx) => {
            const rayGeo = new THREE.CylinderGeometry(0.5, 3.8, 48, 12, 1, true);
            const rayMat = new THREE.MeshBasicMaterial({
                color: rayColor,
                transparent: true,
                opacity: 0.14,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const shaft = new THREE.Mesh(rayGeo, rayMat);
            shaft.position.set(x, 16, -10 + idx * 8);
            shaft.rotation.x = -Math.PI * 0.18;
            shaft.rotation.z = (Math.random() - 0.5) * 0.1;
            group.add(shaft);
        });

        // Layered Volumetric Ground Fog Planes
        const fogColor = theme === 'forest' ? 0x2A1535 : (theme === 'graveyard' ? 0x0A202A : 0x2E1010);
        for (let i = 0; i < 4; i++) {
            const fogGeo = new THREE.PlaneGeometry(110, 110);
            fogGeo.rotateX(-Math.PI / 2);
            const fogMat = new THREE.MeshBasicMaterial({
                map: this.textures.smokeCloud,
                color: fogColor,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const fogPlane = new THREE.Mesh(fogGeo, fogMat);
            fogPlane.position.y = 0.25 + i * 0.4;
            fogPlane.position.z = -8;
            group.add(fogPlane);
        }

        scene.add(group);
        return group;
    }

    // ==========================================
    // CONTINUOUS AMBIENT PARTICLES (SAKURA, FIREFLIES, EMBERS)
    // ==========================================
    buildAmbientParticleSystem(scene, theme) {
        const group = new THREE.Group();
        group.name = "ultra_ambient_particles";
        this.ambientParticles = [];

        // 1. Swirling Sakura Petals (for forest) or Ghost Wisps (for graveyard) or Fiery Embers (for temple)
        const count = 90;
        for (let i = 0; i < count; i++) {
            let pMesh;
            let pType = 'sakura';

            if (theme === 'forest') {
                const geo = new THREE.PlaneGeometry(0.35, 0.4);
                const mat = new THREE.MeshBasicMaterial({
                    map: this.textures.sakuraPetal,
                    transparent: true,
                    opacity: 0.85,
                    side: THREE.DoubleSide,
                    depthWrite: false
                });
                pMesh = new THREE.Mesh(geo, mat);
                pType = 'sakura';
            } else if (theme === 'graveyard') {
                const geo = new THREE.SphereGeometry(0.12, 6, 6);
                const mat = new THREE.MeshBasicMaterial({
                    color: 0x00E5FF,
                    transparent: true,
                    opacity: 0.9,
                    blending: THREE.AdditiveBlending
                });
                pMesh = new THREE.Mesh(geo, mat);
                pType = 'wisp';
            } else {
                const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
                const mat = new THREE.MeshBasicMaterial({
                    color: 0xFF6D00,
                    transparent: true,
                    opacity: 0.95,
                    blending: THREE.AdditiveBlending
                });
                pMesh = new THREE.Mesh(geo, mat);
                pType = 'ember';
            }

            pMesh.position.set(
                (Math.random() - 0.5) * 60,
                0.5 + Math.random() * 12,
                (Math.random() - 0.5) * 70
            );

            group.add(pMesh);
            this.ambientParticles.push({
                mesh: pMesh,
                type: pType,
                vel: new THREE.Vector3(
                    (Math.random() - 0.5) * 1.5 - 0.5,
                    pType === 'ember' ? 0.8 + Math.random() * 1.5 : (pType === 'sakura' ? -0.6 - Math.random() * 0.4 : (Math.random() - 0.5) * 0.5),
                    (Math.random() - 0.5) * 1.5 - 0.8
                ),
                rotSpeed: new THREE.Vector3(Math.random() * 2, Math.random() * 3, Math.random() * 2),
                baseY: pMesh.position.y,
                phase: Math.random() * Math.PI * 2
            });
        }

        scene.add(group);
        return group;
    }

    // ==========================================
    // REGISTER DYNAMIC FLICKERING LANTERNS
    // ==========================================
    registerFlickerLight(pointLight, baseIntensity = 1.0, colorHex = 0xFFA000) {
        this.flickerLights.push({
            light: pointLight,
            base: baseIntensity,
            color: colorHex,
            speed: 4 + Math.random() * 6,
            phase: Math.random() * 10
        });
    }

    // ==========================================
    // UPDATE FRAME (ANIMATE WIND, MOON RING, PARTICLES)
    // ==========================================
    update(dt) {
        this.windTime += dt;

        // Animate moon ring rotation
        if (this.moonRing) {
            this.moonRing.rotation.z += dt * 0.05;
        }

        // Animate grass tufts swaying in wind
        const windWave = Math.sin(this.windTime * 2.4);
        const windWave2 = Math.cos(this.windTime * 1.8);
        for (let i = 0; i < this.grassClusters.length; i++) {
            const tuft = this.grassClusters[i];
            const offset = (tuft.position.x + tuft.position.z) * 0.2;
            tuft.rotation.z = Math.sin(this.windTime * 3.0 + offset) * 0.18;
            tuft.rotation.x = Math.cos(this.windTime * 2.2 + offset) * 0.12;
        }

        // Animate ambient particles
        for (let i = 0; i < this.ambientParticles.length; i++) {
            const p = this.ambientParticles[i];
            p.mesh.position.addScaledVector(p.vel, dt);
            p.mesh.rotation.x += p.rotSpeed.x * dt;
            p.mesh.rotation.y += p.rotSpeed.y * dt;
            p.mesh.rotation.z += p.rotSpeed.z * dt;

            if (p.type === 'sakura') {
                p.mesh.position.x += Math.sin(this.windTime * 2.0 + p.phase) * dt * 1.2;
                if (p.mesh.position.y < 0.1) {
                    p.mesh.position.y = 10 + Math.random() * 4;
                    p.mesh.position.x = (Math.random() - 0.5) * 50;
                    p.mesh.position.z = (Math.random() - 0.5) * 60;
                }
            } else if (p.type === 'ember') {
                p.mesh.position.x += (Math.random() - 0.5) * dt * 2.0;
                if (p.mesh.position.y > 12) {
                    p.mesh.position.y = 0.5;
                    p.mesh.position.x = (Math.random() - 0.5) * 40;
                    p.mesh.position.z = (Math.random() - 0.5) * 50;
                }
            } else if (p.type === 'wisp') {
                p.mesh.position.y = p.baseY + Math.sin(this.windTime * 2.0 + p.phase) * 0.8;
                if (p.mesh.position.z < -45) p.mesh.position.z = 25;
            }
        }

        // Animate flickering lights
        for (let i = 0; i < this.flickerLights.length; i++) {
            const fl = this.flickerLights[i];
            const noise = Math.sin(this.windTime * fl.speed + fl.phase) * 0.25 + (Math.random() - 0.5) * 0.15;
            fl.light.intensity = Math.max(0.2, fl.base + noise);
        }
    }
}

window.ultraGraphics = new UltraGraphicsEngine();
