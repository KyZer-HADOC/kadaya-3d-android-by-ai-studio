// Third-Person Camera Controller for KADAYA: THE AGE OF SHADOWS
// Built with Three.js

class ThirdPersonCamera {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.target = new THREE.Vector3();
        this.currentPosition = new THREE.Vector3(0, 3, 5);
        this.currentLookAt = new THREE.Vector3(0, 1.2, 0);

        this.yaw = 0; // Horizontal rotation
        this.pitch = 0.25; // Vertical tilt
        this.distance = 4.8;
        this.minDistance = 2.5;
        this.maxDistance = 8.0;

        // Smooth follow settings
        this.smoothDamping = 0.12;

        // Camera Shake
        this.shakeIntensity = 0;
        this.shakeTimer = 0;
        this.shakeOffset = new THREE.Vector3();

        this.initControls();
    }

    initControls() {
        let isDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

        // Mouse look with pointer drag or pointer lock
        this.domElement.addEventListener('mousedown', (e) => {
            // Don't capture if clicking on UI buttons
            if (e.target.closest('button') || e.target.closest('.ui-interactive')) return;
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === this.domElement) {
                this.rotate(e.movementX * 0.003, e.movementY * 0.003);
            } else if (isDragging) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                this.rotate(dx * 0.005, dy * 0.005);
            }
        });

        // Touch drag for camera rotation
        let touchStartX = 0;
        let touchStartY = 0;
        let isTouchingCameraZone = false;

        this.domElement.addEventListener('touchstart', (e) => {
            for (let i = 0; i < e.touches.length; i++) {
                const t = e.touches[i];
                // Right half of screen acts as camera rotation pad if not hitting action buttons
                if (t.clientX > window.innerWidth * 0.4 && !t.target.closest('button')) {
                    isTouchingCameraZone = true;
                    touchStartX = t.clientX;
                    touchStartY = t.clientY;
                    break;
                }
            }
        }, { passive: true });

        this.domElement.addEventListener('touchmove', (e) => {
            if (!isTouchingCameraZone) return;
            for (let i = 0; i < e.touches.length; i++) {
                const t = e.touches[i];
                if (t.clientX > window.innerWidth * 0.3) {
                    const dx = t.clientX - touchStartX;
                    const dy = t.clientY - touchStartY;
                    touchStartX = t.clientX;
                    touchStartY = t.clientY;
                    this.rotate(dx * 0.006, dy * 0.006);
                    break;
                }
            }
        }, { passive: true });

        this.domElement.addEventListener('touchend', () => {
            isTouchingCameraZone = false;
        });

        // Mouse wheel zoom
        this.domElement.addEventListener('wheel', (e) => {
            this.distance = THREE.MathUtils.clamp(
                this.distance + e.deltaY * 0.005,
                this.minDistance,
                this.maxDistance
            );
        }, { passive: true });
    }

    rotate(deltaX, deltaY) {
        this.yaw -= deltaX;
        this.pitch = THREE.MathUtils.clamp(this.pitch - deltaY, -0.2, 1.1);
    }

    triggerShake(intensity = 0.3, duration = 0.25) {
        this.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }

    update(dt, playerPosition, terrainHeightFn) {
        if (!playerPosition) return;

        // Target center around player chest height
        this.target.set(playerPosition.x, playerPosition.y + 1.3, playerPosition.z);

        // Calculate desired camera orbit offset
        const cosPitch = Math.cos(this.pitch);
        const sinPitch = Math.sin(this.pitch);
        const sinYaw = Math.sin(this.yaw);
        const cosYaw = Math.cos(this.yaw);

        const desiredOffset = new THREE.Vector3(
            this.distance * cosPitch * sinYaw,
            this.distance * sinPitch,
            this.distance * cosPitch * cosYaw
        );

        const desiredPosition = new THREE.Vector3().addVectors(this.target, desiredOffset);

        // Terrain collision avoidance
        const terrainY = terrainHeightFn ? terrainHeightFn(desiredPosition.x, desiredPosition.z) : 0;
        if (desiredPosition.y < terrainY + 0.6) {
            desiredPosition.y = terrainY + 0.6;
        }

        // Camera Shake update
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            const s = this.shakeIntensity * (this.shakeTimer / 0.3);
            this.shakeOffset.set(
                (Math.random() - 0.5) * s,
                (Math.random() - 0.5) * s,
                (Math.random() - 0.5) * s
            );
        } else {
            this.shakeOffset.set(0, 0, 0);
        }

        // Smooth position and look-at interpolation
        this.currentPosition.lerp(desiredPosition, this.smoothDamping);
        this.currentLookAt.lerp(this.target, this.smoothDamping);

        this.camera.position.copy(this.currentPosition).add(this.shakeOffset);
        this.camera.lookAt(this.currentLookAt);
    }
}

window.ThirdPersonCamera = ThirdPersonCamera;
