// 3D Ninja Character Model, Transformations, Weapons, Susanoo & Summons
// For KADAYA: THE LAST SHADOW - Built with Three.js

class NinjaCharacter {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Stats & Attributes
        this.maxHealth = 120;
        this.health = 120;
        this.maxStamina = 100;
        this.stamina = 100;
        this.maxChakra = 100;
        this.chakra = 100;
        this.reaperGauge = 100; // 0 to 100
        this.isAlive = true;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        this.isStealthed = false;
        this.stealthTimer = 0;

        // Upgrades multipliers
        this.statMultipliers = {
            hp: 1.0,
            atk: 1.0,
            speed: 1.0,
            dashCd: 1.0,
            chakra: 1.0,
            reaperTime: 1.0
        };

        // Forms: 'normal', 'awakened', 'reaper'
        this.currentForm = 'normal';
        this.transformationTimer = 0;

        // Susanoo State
        this.isSusanooActive = false;
        this.susanooTimer = 0;
        this.susanooMesh = null;
        this.equippedSusanoo = 'azure_susanoo';

        // Equipped Weapon & Eye & Summon
        this.equippedWeapon = 'reaper_scythe';
        this.equippedEye = 'sharingan3';
        this.equippedSummon = 'toad_bunta';

        // Position & Movement
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotationY = 0;
        this.targetRotationY = 0;
        this.baseSpeed = 7.8;
        this.sprintMultiplier = 1.65;
        this.isSprinting = false;
        this.isGrounded = true;
        this.jumpForce = 13.5;
        this.gravity = 30.0;

        // Combat & Combo
        this.isAttacking = false;
        this.comboStep = 0;
        this.comboTimer = 0;
        this.attackCooldown = 0;
        this.attackProgress = 0;

        // Dash
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashDuration = 0.26;
        this.dashCooldown = 0;
        this.dashSpeed = 28.0;
        this.dashDirection = new THREE.Vector3();

        // Active Ability State
        this.activeAbility = null;
        this.abilityTimer = 0;
        this.abilityCooldowns = {
            dash: 0,
            shuriken: 0,
            kenjutsu: 0,
            stealth: 0,
            clone: 0,
            teleport: 0,
            rasengan: 0,
            eyePower: 0,
            susanoo: 0,
            summon: 0
        };

        // Active Clones & Summons
        this.activeClones = [];
        this.activeSummonEntity = null;

        // Skeleton & Meshes
        this.bones = {};
        this.scarfSegments = [];
        this.weaponGroup = null;
        this.reaperWings = null;
        this.reaperMantle = null;
        this.auraMesh = null;

        this.animState = 'idle';
        this.animTime = 0;

        // Sword Trail Ribbon
        this.swordTrail = null;
        this.swordTrailPoints = [];
        this.maxTrailPoints = 14;

        this.buildCharacterMesh();
        this.buildWeaponMesh();
        this.buildReaperParts();
        this.buildSusanooMesh();
        this.buildSwordTrail();
    }

    buildCharacterMesh() {
        const ug = window.ultraGraphics;
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xE8BEAC, roughness: 0.6 });
        const suitMat = new THREE.MeshStandardMaterial({
            color: 0x161822,
            roughness: 0.5,
            metalness: 0.2,
            normalMap: ug ? ug.textures.clothNormal : null
        });
        const armorMat = new THREE.MeshStandardMaterial({
            color: 0x0E1017,
            roughness: 0.35,
            metalness: 0.85,
            normalMap: ug ? ug.textures.clothNormal : null
        });
        const scarfMat = new THREE.MeshStandardMaterial({
            color: 0xC62828,
            roughness: 0.6,
            normalMap: ug ? ug.textures.clothNormal : null
        });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x0A0B0E, roughness: 0.75 });
        const metalMat = new THREE.MeshStandardMaterial({
            color: 0xD0D0D0,
            roughness: 0.15,
            metalness: 0.95
        });
        const eyeCyan = new THREE.MeshBasicMaterial({ color: 0x00E5FF });

        // Root & Pelvis
        const root = new THREE.Group();
        this.group.add(root);
        this.bones.root = root;

        const pelvis = new THREE.Group();
        pelvis.position.y = 1.0;
        root.add(pelvis);
        this.bones.pelvis = pelvis;

        // Hips & Belt
        const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.28, 8), suitMat);
        hips.castShadow = true;
        pelvis.add(hips);

        const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 8), scarfMat);
        belt.position.y = 0.08;
        pelvis.add(belt);

        // Spine & Torso
        const spine = new THREE.Group();
        spine.position.y = 0.14;
        pelvis.add(spine);
        this.bones.spine = spine;

        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.44, 8), suitMat);
        torso.position.y = 0.22;
        torso.castShadow = true;
        spine.add(torso);

        const vest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.26), armorMat);
        vest.position.y = 0.22;
        vest.castShadow = true;
        spine.add(vest);

        // Head & Neck
        const neck = new THREE.Group();
        neck.position.y = 0.44;
        spine.add(neck);
        this.bones.neck = neck;

        const head = new THREE.Group();
        head.position.y = 0.1;
        neck.add(head);
        this.bones.head = head;

        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), skinMat);
        headMesh.position.y = 0.14;
        head.add(headMesh);

        // Ninja Mask
        const mask = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.14, 10, 1, false, 0, Math.PI), suitMat);
        mask.position.set(0, 0.1, 0.06);
        mask.rotation.y = -Math.PI / 2;
        head.add(mask);

        // Anime Eyes
        [-0.065, 0.065].forEach(x => {
            const eye = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.01), eyeCyan);
            eye.position.set(x, 0.16, 0.17);
            head.add(eye);
        });

        // Headband (Hitai-ate)
        const headband = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.07, 12), scarfMat);
        headband.position.y = 0.21;
        head.add(headband);

        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.02), metalMat);
        plate.position.set(0, 0.21, 0.19);
        head.add(plate);

        // Anime Spiky Hair
        const hairTufts = [
            { pos: [0, 0.28, 0], scale: [0.22, 0.18, 0.24] },
            { pos: [0, 0.35, -0.05], scale: [0.15, 0.22, 0.15], rot: [-0.3, 0, 0] },
            { pos: [0.12, 0.32, -0.04], scale: [0.12, 0.2, 0.12], rot: [-0.2, 0, -0.4] },
            { pos: [-0.12, 0.32, -0.04], scale: [0.12, 0.2, 0.12], rot: [-0.2, 0, 0.4] },
            { pos: [0, 0.25, -0.16], scale: [0.14, 0.22, 0.12], rot: [-0.6, 0, 0] }
        ];
        hairTufts.forEach(h => {
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.0, 5), hairMat);
            cone.position.set(...h.pos);
            cone.scale.set(...h.scale);
            if (h.rot) cone.rotation.set(...h.rot);
            head.add(cone);
        });

        // Flowing Red Scarf
        const scarfRoot = new THREE.Group();
        scarfRoot.position.set(0, 0.02, -0.12);
        neck.add(scarfRoot);

        let parentSeg = scarfRoot;
        for (let s = 0; s < 5; s++) {
            const seg = new THREE.Group();
            seg.position.set(0, -0.08, -0.06);
            parentSeg.add(seg);
            const sMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16 - s * 0.015, 0.12, 0.02), scarfMat);
            sMesh.castShadow = true;
            seg.add(sMesh);
            this.scarfSegments.push(seg);
            parentSeg = seg;
        }

        // Arms & Shoulders
        this.bones.leftArm = this.createLimb(spine, -1, false, suitMat, armorMat, skinMat);
        this.bones.rightArm = this.createLimb(spine, 1, false, suitMat, armorMat, skinMat);

        // Legs
        this.bones.leftLeg = this.createLimb(pelvis, -1, true, suitMat, armorMat, skinMat);
        this.bones.rightLeg = this.createLimb(pelvis, 1, true, suitMat, armorMat, skinMat);

        // Aura Mesh (for Awakened / Reaper forms)
        const auraGeo = new THREE.CylinderGeometry(0.8, 0.9, 2.2, 12, 1, true);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0x9D00FF,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        this.auraMesh = new THREE.Mesh(auraGeo, auraMat);
        this.auraMesh.position.y = 1.1;
        this.group.add(this.auraMesh);

        this.group.scale.set(1.15, 1.15, 1.15);
    }

    createLimb(parent, side, isLeg, suitMat, armorMat, skinMat) {
        const root = new THREE.Group();
        if (isLeg) {
            root.position.set(side * 0.12, -0.12, 0);
        } else {
            root.position.set(side * 0.24, 0.36, 0);
        }
        parent.add(root);

        const upper = new THREE.Group();
        root.add(upper);

        const uLen = isLeg ? 0.38 : 0.28;
        const uMesh = new THREE.Mesh(new THREE.CylinderGeometry(isLeg ? 0.09 : 0.065, isLeg ? 0.07 : 0.055, uLen, 8), suitMat);
        uMesh.position.y = -uLen / 2;
        uMesh.castShadow = true;
        upper.add(uMesh);

        const lower = new THREE.Group();
        lower.position.y = -uLen;
        upper.add(lower);

        const lLen = isLeg ? 0.38 : 0.26;
        const lMesh = new THREE.Mesh(new THREE.CylinderGeometry(isLeg ? 0.07 : 0.06, isLeg ? 0.06 : 0.05, lLen, 8), suitMat);
        lMesh.position.y = -lLen / 2;
        lMesh.castShadow = true;
        lower.add(lMesh);

        const end = new THREE.Group();
        end.position.y = -lLen;
        lower.add(end);

        const endMesh = new THREE.Mesh(
            isLeg ? new THREE.BoxGeometry(0.08, 0.07, 0.18) : new THREE.BoxGeometry(0.07, 0.09, 0.05),
            isLeg ? suitMat : skinMat
        );
        endMesh.position.set(0, isLeg ? -0.035 : -0.045, isLeg ? 0.05 : 0);
        end.add(endMesh);

        return { root, upper, lower, end };
    }

    buildWeaponMesh() {
        if (this.weaponGroup) {
            this.bones.rightArm.end.remove(this.weaponGroup);
        }

        this.weaponGroup = new THREE.Group();
        this.bones.rightArm.end.add(this.weaponGroup);

        const ug = window.ultraGraphics;
        const bladeMat = new THREE.MeshStandardMaterial({
            map: ug ? ug.textures.bladeDamascus : null,
            color: 0xFFFFFF,
            roughness: 0.1,
            metalness: 0.98
        });
        const scytheMat = new THREE.MeshStandardMaterial({ color: 0x1A1024, roughness: 0.25, metalness: 0.85 });
        const goldMat = new THREE.MeshStandardMaterial({
            map: ug ? ug.textures.goldFiligree : null,
            color: 0xFFD700,
            roughness: 0.2,
            metalness: 0.9,
            emissive: 0xFF8F00,
            emissiveIntensity: 0.2
        });
        const glowPurple = new THREE.MeshBasicMaterial({ color: 0x9D00FF });

        if (this.equippedWeapon === 'reaper_scythe' || this.currentForm === 'reaper') {
            // Iconic Grim Reaper Scythe
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8), scytheMat);
            shaft.position.y = 0.2;
            this.weaponGroup.add(shaft);

            // Curved crescent scythe blade
            const scytheHead = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 8, 16, Math.PI * 0.65), bladeMat);
            scytheHead.position.set(0.35, 1.0, 0);
            scytheHead.rotation.z = -Math.PI / 3;
            this.weaponGroup.add(scytheHead);

            // Skull ornament & glowing edge
            const skull = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), goldMat);
            skull.position.set(0, 1.05, 0);
            this.weaponGroup.add(skull);

            const glowEdge = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.015, 6, 16, Math.PI * 0.6), glowPurple);
            glowEdge.position.set(0.35, 1.0, 0);
            glowEdge.rotation.z = -Math.PI / 3;
            this.weaponGroup.add(glowEdge);

            this.weaponGroup.position.set(0, -0.06, 0.1);
            this.weaponGroup.rotation.set(-Math.PI / 2, 0, 0);
        } else if (this.equippedWeapon === 'nodachi') {
            // Heavy 2-handed greatsword
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.02), bladeMat);
            blade.position.y = 0.75;
            this.weaponGroup.add(blade);
            this.weaponGroup.position.set(0, -0.06, 0.1);
            this.weaponGroup.rotation.set(-Math.PI / 2, 0, 0);
        } else if (this.equippedWeapon === 'twin_daggers') {
            // Daggers
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.015), bladeMat);
            blade.position.y = 0.25;
            this.weaponGroup.add(blade);
            this.weaponGroup.position.set(0, -0.06, 0.1);
            this.weaponGroup.rotation.set(-Math.PI / 2, 0, 0);
        } else {
            // Standard Katana / Muramasa / Celestial
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.95, 0.015), bladeMat);
            blade.position.y = 0.48;
            this.weaponGroup.add(blade);
            this.weaponGroup.position.set(0, -0.06, 0.1);
            this.weaponGroup.rotation.set(-Math.PI / 2, 0, 0);
        }
    }

    buildReaperParts() {
        // Demonic Shadow Wings (only visible in Reaper form)
        this.reaperWings = new THREE.Group();
        this.bones.spine.add(this.reaperWings);
        this.reaperWings.visible = false;

        const wingMat = new THREE.MeshStandardMaterial({
            color: 0x1A092A,
            emissive: 0x9D00FF,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });

        [-1, 1].forEach(side => {
            const wing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.03), wingMat);
            wing.position.set(side * 0.9, 0.4, -0.3);
            wing.rotation.set(0.2, side * 0.4, side * 0.35);
            this.reaperWings.add(wing);
        });
    }

    buildSusanooMesh() {
        this.susanooMesh = new THREE.Group();
        this.group.add(this.susanooMesh);
        this.susanooMesh.visible = false;

        const isCrimson = this.equippedSusanoo === 'crimson_susanoo';
        const color = isCrimson ? 0xFF1744 : 0x00E5FF;
        const flameColor = isCrimson ? 0xFF5252 : 0x80D8FF;

        const susanooMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.55,
            wireframe: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        const flameMat = new THREE.MeshBasicMaterial({
            color: flameColor,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        // Giant spectral ribcage
        for (let r = 0; r < 6; r++) {
            const rib = new THREE.Mesh(new THREE.TorusGeometry(1.5 - r * 0.12, 0.09, 8, 16, Math.PI), susanooMat);
            rib.position.set(0, 0.7 + r * 0.38, 0);
            rib.rotation.x = Math.PI / 2;
            this.susanooMesh.add(rib);
        }

        // Spectral Spine Column
        const spineMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.2, 8), susanooMat);
        spineMesh.position.set(0, 1.8, -0.45);
        this.susanooMesh.add(spineMesh);

        // Demon Warrior Horns
        [-1, 1].forEach(side => {
            const horn = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.1, 6), susanooMat);
            horn.position.set(side * 0.75, 3.2, 0.1);
            horn.rotation.set(-0.2, 0, side * -0.5);
            this.susanooMesh.add(horn);

            // Spectral Pauldrons
            const pauldron = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.45, 0.95), susanooMat);
            pauldron.position.set(side * 1.7, 2.5, 0);
            pauldron.rotation.z = side * -0.3;
            this.susanooMesh.add(pauldron);

            // Giant spectral arms & twin blazing greatswords
            const sArm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 1.9, 8), susanooMat);
            sArm.position.set(side * 2.0, 1.8, 0.4);
            sArm.rotation.set(-0.4, 0, side * 0.3);
            this.susanooMesh.add(sArm);

            const sSword = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.4, 0.05), susanooMat);
            sSword.position.set(side * 2.2, 1.8, 1.4);
            sSword.rotation.set(-1.2, 0, side * 0.2);
            this.susanooMesh.add(sSword);

            // Blazing flame aura sheath around swords
            const swordAura = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.6, 0.1), flameMat);
            swordAura.position.copy(sSword.position);
            swordAura.rotation.copy(sSword.rotation);
            this.susanooMesh.add(swordAura);
        });
    }

    buildSwordTrail() {
        const trailGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(this.maxTrailPoints * 2 * 3);
        trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const trailMat = new THREE.MeshBasicMaterial({
            color: 0x9D00FF,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        this.swordTrail = new THREE.Mesh(trailGeo, trailMat);
        this.swordTrail.frustumCulled = false;
        this.scene.add(this.swordTrail);
    }

    transformReaper() {
        if (this.currentForm === 'reaper') return;
        this.currentForm = 'reaper';
        this.transformationTimer = 18.0 * this.statMultipliers.reaperTime;
        this.invulnerableTimer = 1.0;
        this.reaperWings.visible = true;
        this.auraMesh.material.opacity = 0.55;
        this.buildWeaponMesh(); // Switch to Scythe

        if (window.soundEngine) window.soundEngine.playReaperTransformation();
    }

    toggleSusanoo() {
        this.isSusanooActive = !this.isSusanooActive;
        this.susanooMesh.visible = this.isSusanooActive;
        this.susanooTimer = 14.0;
        if (this.isSusanooActive && window.soundEngine) {
            window.soundEngine.playSusanooRoar();
        }
    }

    triggerEyePower(enemies, spawnParticleFn) {
        if (this.abilityCooldowns.eyePower > 0 || this.chakra < 25) return;
        this.abilityCooldowns.eyePower = 8.0;
        this.chakra -= 25;

        if (window.soundEngine) window.soundEngine.playEyeActivation();

        if (this.equippedEye === 'rinnegan') {
            // Almighty Push (Shinra Tensei)
            if (window.soundEngine) window.soundEngine.playAlmightyPush();
            if (spawnParticleFn) {
                spawnParticleFn(this.position.x, this.position.y + 0.5, this.position.z, 'shockwave');
            }
            if (enemies) {
                enemies.forEach(e => {
                    if (e.isAlive && e.position.distanceTo(this.position) < 12.0) {
                        const pushDir = new THREE.Vector3().subVectors(e.position, this.position).normalize();
                        e.takeDamage(85 * this.statMultipliers.atk, pushDir.multiplyScalar(14.0), true);
                    }
                });
            }
        } else if (this.equippedEye === 'sharingan3' || this.equippedEye === 'eternal_mangekyo') {
            // Matrix-like slow motion perception
            window.gameSlowMoTimer = 3.0;
            if (spawnParticleFn) {
                spawnParticleFn(this.position.x, this.position.y + 1.2, this.position.z, 'chakraSpiral');
            }
        } else if (this.equippedEye === 'byakugan') {
            // Reveal weak points / burst
            if (enemies) {
                enemies.forEach(e => {
                    if (e.isAlive && e.position.distanceTo(this.position) < 15.0) {
                        e.takeDamage(40, null, false);
                    }
                });
            }
        }
    }

    triggerSummon(spawnParticleFn) {
        if (this.abilityCooldowns.summon > 0 || this.chakra < 40) return;
        this.abilityCooldowns.summon = 25.0;
        this.chakra -= 40;

        if (this.activeSummonEntity) {
            this.activeSummonEntity.destroy();
        }

        const summonData = window.KADAYA_DATA.summons.find(s => s.id === this.equippedSummon) || window.KADAYA_DATA.summons[0];
        this.activeSummonEntity = new SummonCompanion(this.scene, summonData, this.position, this.rotationY);

        if (window.soundEngine) window.soundEngine.playSummonCircle();
        if (spawnParticleFn) {
            spawnParticleFn(this.position.x + 2.0, this.position.y + 0.8, this.position.z, 'shockwave');
        }
    }

    update(dt, input, terrainHeightFn, enemies, spawnParticleFn, spawnProjectileFn) {
        if (!this.isAlive) {
            this.animateDeath(dt);
            return;
        }

        this.animTime += dt;

        // Timers
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
        if (this.stealthTimer > 0) {
            this.stealthTimer -= dt;
            if (this.stealthTimer <= 0) this.isStealthed = false;
        }

        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) this.comboStep = 0;
        }

        // Transformation Countdown
        if (this.currentForm === 'reaper') {
            this.transformationTimer -= dt;
            if (this.transformationTimer <= 0) {
                this.currentForm = 'normal';
                this.reaperWings.visible = false;
                this.auraMesh.material.opacity = 0;
                this.buildWeaponMesh();
            }
        }

        // Susanoo Countdown
        if (this.isSusanooActive) {
            this.susanooTimer -= dt;
            if (this.susanooTimer <= 0) {
                this.isSusanooActive = false;
                this.susanooMesh.visible = false;
            }
        }

        // Cooldowns
        for (const k in this.abilityCooldowns) {
            if (this.abilityCooldowns[k] > 0) {
                this.abilityCooldowns[k] = Math.max(0, this.abilityCooldowns[k] - dt);
            }
        }

        // Stamina and Chakra Regen
        if (this.stamina < this.maxStamina && !this.isSprinting) {
            this.stamina = Math.min(this.maxStamina, this.stamina + 28 * dt);
        }
        if (this.chakra < this.maxChakra) {
            this.chakra = Math.min(this.maxChakra, this.chakra + 16 * dt * this.statMultipliers.chakra);
        }

        // Action States
        if (this.isDashing) {
            this.updateDash(dt, spawnParticleFn);
        } else if (this.activeAbility) {
            this.updateAbility(dt, spawnParticleFn, spawnProjectileFn, enemies);
        } else if (this.isAttacking) {
            this.updateAttack(dt, enemies, spawnParticleFn);
        } else {
            this.handleMovement(dt, input, terrainHeightFn, spawnParticleFn);
            this.handleCombatInputs(input, spawnParticleFn, spawnProjectileFn, enemies);
        }

        // Scarf & Wings Animation
        this.animateScarf(dt);
        if (this.reaperWings && this.reaperWings.visible) {
            const flap = Math.sin(this.animTime * 6) * 0.15;
            this.reaperWings.children[0].rotation.y = 0.4 + flap;
            this.reaperWings.children[1].rotation.y = -0.4 - flap;
        }

        this.updateSwordTrail();

        // Update Clones & Summons
        for (let i = this.activeClones.length - 1; i >= 0; i--) {
            const cl = this.activeClones[i];
            cl.update(dt, enemies, spawnParticleFn);
            if (!cl.isAlive) {
                cl.destroy();
                this.activeClones.splice(i, 1);
            }
        }

        if (this.activeSummonEntity) {
            this.activeSummonEntity.update(dt, enemies, spawnParticleFn);
            if (!this.activeSummonEntity.isAlive) {
                this.activeSummonEntity.destroy();
                this.activeSummonEntity = null;
            }
        }

        // Sync position
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotationY;
    }

    handleMovement(dt, input, terrainHeightFn, spawnParticleFn) {
        const moveX = input.moveX;
        const moveZ = input.moveZ;
        const hasInput = (Math.abs(moveX) > 0.1 || Math.abs(moveZ) > 0.1);

        this.isSprinting = input.isSprinting && hasInput && this.stamina > 10;
        if (this.isSprinting) {
            this.stamina = Math.max(0, this.stamina - 20 * dt);
        }

        let speed = this.baseSpeed * this.statMultipliers.speed;
        if (this.currentForm === 'reaper') speed *= 1.25;
        if (this.isSprinting) speed *= this.sprintMultiplier;

        if (hasInput) {
            const camAngle = input.cameraYaw || 0;
            const forward = new THREE.Vector3(-Math.sin(camAngle), 0, -Math.cos(camAngle));
            const right = new THREE.Vector3(Math.cos(camAngle), 0, -Math.sin(camAngle));

            const moveDir = new THREE.Vector3()
                .addScaledVector(right, moveX)
                .addScaledVector(forward, -moveZ)
                .normalize();

            this.velocity.x = moveDir.x * speed;
            this.velocity.z = moveDir.z * speed;
            this.targetRotationY = Math.atan2(moveDir.x, moveDir.z);

            if (this.isGrounded && Math.sin(this.animTime * 14) > 0.95) {
                if (window.soundEngine) window.soundEngine.playFootstep();
            }
        } else {
            this.velocity.x *= 0.65;
            this.velocity.z *= 0.65;
        }

        // Jump
        if (input.jump && this.isGrounded && this.stamina >= 15) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            this.stamina -= 15;
            if (window.soundEngine) window.soundEngine.playJump();
        }

        // Gravity & Ground
        this.velocity.y -= this.gravity * dt;
        this.position.x += this.velocity.x * dt;
        this.position.z += this.velocity.z * dt;
        this.position.y += this.velocity.y * dt;

        const terrainY = terrainHeightFn ? terrainHeightFn(this.position.x, this.position.z) : 0;
        if (this.position.y <= terrainY) {
            this.position.y = terrainY;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        // Rotation Slerp
        let diff = this.targetRotationY - this.rotationY;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.rotationY += diff * Math.min(1.0, 14 * dt);

        // Animations
        if (!this.isGrounded) {
            this.animateJump(dt);
        } else if (hasInput) {
            this.animateRun(dt, this.isSprinting);
        } else {
            this.animateIdle(dt);
        }
    }

    handleCombatInputs(input, spawnParticleFn, spawnProjectileFn, enemies) {
        // Dash
        if (input.dash && this.abilityCooldowns.dash <= 0 && this.stamina >= 20) {
            this.startDash(spawnParticleFn);
            return;
        }

        // Attack
        if (input.attack && this.attackCooldown <= 0 && this.stamina >= 10) {
            this.startAttackCombo();
            return;
        }

        // Transformation Key (F)
        if (input.transform && this.reaperGauge >= 100) {
            this.transformReaper();
            this.reaperGauge = 0;
        }

        // Eye Power (Q / Digit1)
        if (input.ability1) {
            this.triggerEyePower(enemies, spawnParticleFn);
        }

        // Shuriken / Projectile (Digit2)
        if (input.ability2 && this.abilityCooldowns.shuriken <= 0 && this.chakra >= 15) {
            this.triggerShuriken(spawnProjectileFn);
        }

        // Kenjutsu Flurry (Digit3)
        if (input.ability3 && this.abilityCooldowns.kenjutsu <= 0 && this.chakra >= 25) {
            this.triggerKenjutsu();
        }

        // Hidden Jutsu (Digit4)
        if (input.ability4 && this.abilityCooldowns.stealth <= 0 && this.chakra >= 20) {
            this.triggerHiddenJutsu(spawnParticleFn);
        }

        // Rasengan Sphere (Digit5)
        if (input.ability5 && this.abilityCooldowns.rasengan <= 0 && this.chakra >= 35) {
            this.triggerRasengan();
        }

        // Summon
        if (input.summon) {
            this.triggerSummon(spawnParticleFn);
        }

        // Susanoo
        if (input.susanoo) {
            this.toggleSusanoo();
        }
    }

    startDash(spawnParticleFn) {
        this.isDashing = true;
        this.dashTimer = this.dashDuration;
        this.abilityCooldowns.dash = 1.0 * this.statMultipliers.dashCd;
        this.stamina -= 20;
        this.invulnerableTimer = this.dashDuration + 0.1;
        this.dashDirection.set(Math.sin(this.rotationY), 0, Math.cos(this.rotationY)).normalize();

        if (window.soundEngine) window.soundEngine.playShadowDash();
        if (spawnParticleFn) {
            spawnParticleFn(this.position.x, this.position.y + 0.8, this.position.z, 'shadowBurst');
        }
    }

    updateDash(dt, spawnParticleFn) {
        this.dashTimer -= dt;
        this.position.x += this.dashDirection.x * this.dashSpeed * dt;
        this.position.z += this.dashDirection.z * this.dashSpeed * dt;

        if (this.dashTimer <= 0) {
            this.isDashing = false;
        }
    }

    startAttackCombo() {
        this.isAttacking = true;
        this.attackCooldown = 0.32;
        this.comboTimer = 1.0;
        this.stamina -= 10;
        this.comboStep = (this.comboStep % 3) + 1;
        this.attackProgress = 0;

        if (window.soundEngine) {
            if (this.equippedWeapon === 'reaper_scythe' || this.currentForm === 'reaper') {
                window.soundEngine.playScytheAttack();
            } else {
                window.soundEngine.playSwordSwing(0.9 + this.comboStep * 0.15);
            }
        }
    }

    updateAttack(dt, enemies, spawnParticleFn) {
        this.attackProgress += dt * 4.2;
        const p = Math.sin(this.attackProgress * Math.PI);

        if (this.comboStep === 1) {
            this.bones.rightArm.upper.rotation.set(-0.3, -0.4 + p * 2.2, 0.4);
            this.bones.spine.rotation.y = -p * 0.8;
        } else if (this.comboStep === 2) {
            this.bones.rightArm.upper.rotation.set(0.6 - p * 2.0, 0.3, 0.5);
            this.bones.spine.rotation.y = p * 0.9;
        } else {
            this.bones.rightArm.upper.rotation.set(-p * 3.14, 0, 0.2);
            this.bones.spine.rotation.x = p * 0.7;
        }

        if (this.attackProgress >= 0.45 && this.attackProgress <= 0.6) {
            this.checkHitEnemies(enemies, spawnParticleFn);
        }

        if (this.attackProgress >= 1.0) {
            this.isAttacking = false;
            this.bones.spine.rotation.set(0, 0, 0);
        }
    }

    checkHitEnemies(enemies, spawnParticleFn) {
        if (!enemies || enemies.length === 0) return;

        const fwd = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));
        const attackOrigin = new THREE.Vector3().copy(this.position).addScaledVector(fwd, 1.6);
        attackOrigin.y += 0.8;

        let hitRadius = 2.4;
        let baseDmg = 28 * this.statMultipliers.atk;

        if (this.currentForm === 'reaper') {
            baseDmg *= 1.8;
            hitRadius = 3.6;
        }
        if (this.isStealthed) {
            baseDmg *= 3.0; // Stealth strike bonus
            this.isStealthed = false;
        }

        enemies.forEach(enemy => {
            if (!enemy.isAlive) return;
            const dist = attackOrigin.distanceTo(enemy.position);
            if (dist <= hitRadius) {
                const knockback = fwd.clone().multiplyScalar(this.comboStep === 3 ? 10.0 : 5.0);
                enemy.takeDamage(baseDmg, knockback, this.comboStep === 3);

                // Build Reaper Gauge on hits
                this.reaperGauge = Math.min(100, this.reaperGauge + 6);

                if (window.soundEngine) window.soundEngine.playHitImpact(this.comboStep === 3);
                if (spawnParticleFn) {
                    spawnParticleFn(enemy.position.x, enemy.position.y + 1.0, enemy.position.z, 'hitSpark');
                }
            }
        });
    }

    triggerShuriken(spawnProjectileFn) {
        this.abilityCooldowns.shuriken = 2.5;
        this.chakra -= 15;
        const fwd = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));

        [-0.25, 0, 0.25].forEach(offset => {
            const dir = fwd.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), offset);
            if (spawnProjectileFn) {
                spawnProjectileFn(
                    new THREE.Vector3().copy(this.position).add(new THREE.Vector3(0, 1.1, 0)),
                    dir,
                    'shuriken',
                    25 * this.statMultipliers.atk
                );
            }
        });
        if (window.soundEngine) window.soundEngine.playWindStrike();
    }

    triggerKenjutsu() {
        this.activeAbility = 'kenjutsu';
        this.abilityTimer = 0.6;
        this.abilityCooldowns.kenjutsu = 3.5;
        this.chakra -= 25;
        if (window.soundEngine) window.soundEngine.playSwordSwing(1.3);
    }

    triggerHiddenJutsu(spawnParticleFn) {
        this.abilityCooldowns.stealth = 8.0;
        this.chakra -= 20;
        this.isStealthed = true;
        this.stealthTimer = 7.0;
        if (window.soundEngine) window.soundEngine.playShadowDash();
        if (spawnParticleFn) {
            spawnParticleFn(this.position.x, this.position.y + 1.0, this.position.z, 'shadowBurst');
        }
    }

    triggerRasengan() {
        this.activeAbility = 'rasengan';
        this.abilityTimer = 0.8;
        this.abilityCooldowns.rasengan = 7.0;
        this.chakra -= 35;
        if (window.soundEngine) window.soundEngine.playSpiralSphere();
    }

    updateAbility(dt, spawnParticleFn, spawnProjectileFn, enemies) {
        this.abilityTimer -= dt;

        if (this.activeAbility === 'kenjutsu') {
            const fwd = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));
            this.position.addScaledVector(fwd, 12.0 * dt);
            this.checkHitEnemies(enemies, spawnParticleFn);
        } else if (this.activeAbility === 'rasengan') {
            const fwd = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));
            this.position.addScaledVector(fwd, 14.0 * dt);
            if (spawnParticleFn) {
                spawnParticleFn(this.position.x + fwd.x * 0.9, this.position.y + 1.0, this.position.z + fwd.z * 0.9, 'chakraSpiral');
            }
            this.checkHitEnemies(enemies, spawnParticleFn);
        }

        if (this.abilityTimer <= 0) {
            this.activeAbility = null;
        }
    }

    takeDamage(amount) {
        if (!this.isAlive || this.isInvulnerable || this.invulnerableTimer > 0) return;
        let actualDmg = amount;
        if (this.isSusanooActive) actualDmg *= 0.25; // 75% damage reduction

        this.health = Math.max(0, this.health - actualDmg);
        this.invulnerableTimer = 0.5;

        if (window.soundEngine) window.soundEngine.playHitImpact(true);
        if (this.health <= 0) {
            this.isAlive = false;
        }
    }

    animateIdle(dt) {
        const t = this.animTime * 2.5;
        this.bones.spine.position.y = 0.14 + Math.sin(t) * 0.015;
        this.bones.leftArm.upper.rotation.set(Math.sin(t) * 0.05, 0, -0.15);
        this.bones.rightArm.upper.rotation.set(-Math.sin(t) * 0.05, 0, 0.15);
    }

    animateRun(dt, isSprinting) {
        const t = this.animTime * (isSprinting ? 18 : 12);
        this.bones.spine.rotation.x = isSprinting ? 0.45 : 0.25;
        this.bones.leftLeg.upper.rotation.x = Math.sin(t) * 0.9;
        this.bones.rightLeg.upper.rotation.x = -Math.sin(t) * 0.9;
        this.bones.leftArm.upper.rotation.x = Math.sin(t) * 0.8;
        this.bones.rightArm.upper.rotation.x = -Math.sin(t) * 0.8;
    }

    animateJump(dt) {
        this.bones.leftLeg.upper.rotation.set(-0.6, 0, 0);
        this.bones.rightLeg.upper.rotation.set(-0.4, 0, 0);
    }

    animateDeath(dt) {
        if (this.group.rotation.x > -Math.PI / 2) {
            this.group.rotation.x -= dt * 3.0;
        }
    }

    animateScarf(dt) {
        const wind = Math.sin(this.animTime * 8) * 0.3;
        this.scarfSegments.forEach((seg, i) => {
            seg.rotation.x = -0.4 - Math.sin(this.animTime * 10 - i * 0.15) * 0.25;
            seg.rotation.y = wind;
        });
    }

    updateSwordTrail() {
        if (!this.weaponGroup || !this.swordTrail) return;
        const tipWorld = new THREE.Vector3(0, 1.2, 0).applyMatrix4(this.weaponGroup.matrixWorld);
        const baseWorld = new THREE.Vector3(0, 0.2, 0).applyMatrix4(this.weaponGroup.matrixWorld);

        if (this.isAttacking || this.activeAbility) {
            this.swordTrailPoints.unshift({ tip: tipWorld, base: baseWorld });
            if (this.swordTrailPoints.length > this.maxTrailPoints) this.swordTrailPoints.pop();
        } else if (this.swordTrailPoints.length > 0) {
            this.swordTrailPoints.pop();
        }

        const arr = this.swordTrail.geometry.attributes.position.array;
        for (let i = 0; i < this.maxTrailPoints; i++) {
            const idx = i * 6;
            if (i < this.swordTrailPoints.length) {
                const pt = this.swordTrailPoints[i];
                arr[idx] = pt.tip.x; arr[idx + 1] = pt.tip.y; arr[idx + 2] = pt.tip.z;
                arr[idx + 3] = pt.base.x; arr[idx + 4] = pt.base.y; arr[idx + 5] = pt.base.z;
            }
        }
        this.swordTrail.geometry.attributes.position.needsUpdate = true;
    }
}

// Summon Companion Entity
class SummonCompanion {
    constructor(scene, data, playerPos, playerRot) {
        this.scene = scene;
        this.data = data;
        this.isAlive = true;
        this.lifeTime = 22.0;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.position = new THREE.Vector3().copy(playerPos).add(new THREE.Vector3(2.5, 0, 0));
        this.group.position.copy(this.position);
        this.group.rotation.y = playerRot;

        // Visual Representation
        const mat = new THREE.MeshStandardMaterial({
            color: data.category === 'Toads' ? 0x2E7D32 : (data.category === 'Dragon' ? 0x6A1B9A : 0x00838F),
            roughness: 0.5
        });

        const body = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), mat);
        body.position.y = 1.0;
        body.castShadow = true;
        this.group.add(body);

        this.attackTimer = 0;
    }

    update(dt, enemies, spawnParticleFn) {
        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
            this.isAlive = false;
            return;
        }

        // Seek closest enemy
        let closest = null;
        let minDist = 18;
        if (enemies) {
            enemies.forEach(e => {
                if (e.isAlive) {
                    const d = this.position.distanceTo(e.position);
                    if (d < minDist) { minDist = d; closest = e; }
                }
            });
        }

        if (closest) {
            const dir = new THREE.Vector3().subVectors(closest.position, this.position);
            dir.y = 0;
            if (dir.length() > 2.0) {
                dir.normalize();
                this.position.addScaledVector(dir, 7.5 * dt);
                this.group.rotation.y = Math.atan2(dir.x, dir.z);
            } else {
                this.attackTimer += dt;
                if (this.attackTimer > 1.2) {
                    this.attackTimer = 0;
                    closest.takeDamage(this.data.dmg, dir.multiplyScalar(3.0), false);
                    if (spawnParticleFn) {
                        spawnParticleFn(closest.position.x, closest.position.y + 0.8, closest.position.z, 'shockwave');
                    }
                }
            }
        }
        this.group.position.copy(this.position);
    }

    destroy() {
        this.scene.remove(this.group);
    }
}

window.NinjaCharacter = NinjaCharacter;
window.SummonCompanion = SummonCompanion;
