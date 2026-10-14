// Enemies & Boss AI for KADAYA: THE LAST SHADOW
// Built with Three.js

class Enemy {
    constructor(scene, type, position, waypoints = []) {
        this.scene = scene;
        this.type = type; // 'scout', 'samurai', 'spellcaster', 'miniboss', 'finalboss'
        this.waypoints = waypoints;
        this.currentWaypointIdx = 0;

        this.position = new THREE.Vector3().copy(position);
        this.velocity = new THREE.Vector3();
        this.rotationY = 0;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.initStats();

        // AI States: 'PATROL', 'ALERT', 'CHASE', 'ATTACK', 'HURT', 'DEAD'
        this.state = 'PATROL';
        this.alertTimer = 0;
        this.attackTimer = 0;
        this.attackCooldown = 0;
        this.patrolWaitTimer = 0;
        this.hurtTimer = 0;
        this.deathTimer = 0;
        this.animTime = Math.random() * 10;

        // Boss Phase State
        this.bossPhase = 1; // 1, 2, 3 for Raizen
        this.teleportCooldown = 0;

        this.bones = {};
        this.healthBarGroup = null;
        this.healthFillMesh = null;
        this.alertIcon = null;

        this.buildMesh();
        this.buildUI();
    }

    initStats() {
        if (this.type === 'scout') {
            this.maxHealth = 65;
            this.health = 65;
            this.damage = 14;
            this.speed = 5.8;
            this.attackRange = 1.7;
            this.detectRadius = 12.0;
            this.attackCooldownMax = 1.4;
            this.name = "Shadow Scout";
        } else if (this.type === 'samurai') {
            this.maxHealth = 140;
            this.health = 140;
            this.damage = 26;
            this.speed = 4.2;
            this.attackRange = 2.4;
            this.detectRadius = 14.0;
            this.attackCooldownMax = 1.9;
            this.name = "Shadow Samurai";
        } else if (this.type === 'spellcaster') {
            this.maxHealth = 75;
            this.health = 75;
            this.damage = 20;
            this.speed = 3.6;
            this.attackRange = 11.0;
            this.detectRadius = 16.0;
            this.attackCooldownMax = 2.6;
            this.name = "Shadow Sorcerer";
        } else if (this.type === 'miniboss') {
            this.maxHealth = 380;
            this.health = 380;
            this.damage = 40;
            this.speed = 4.6;
            this.attackRange = 3.2;
            this.detectRadius = 22.0;
            this.attackCooldownMax = 2.0;
            this.name = "Corrupted Commander";
        } else if (this.type === 'finalboss') {
            // Raizen, The Last Shadow
            this.maxHealth = 1200;
            this.health = 1200;
            this.damage = 50;
            this.speed = 6.0;
            this.attackRange = 3.5;
            this.detectRadius = 35.0;
            this.attackCooldownMax = 1.6;
            this.name = "Lord Raizen";
        }
        this.isAlive = true;
    }

    buildMesh() {
        const shadowMat = new THREE.MeshStandardMaterial({ color: 0x14121E, roughness: 0.6, metalness: 0.3 });
        const armorMat = new THREE.MeshStandardMaterial({
            color: this.type === 'finalboss' ? 0x2A1535 : 0x222430,
            roughness: 0.3,
            metalness: 0.8
        });
        const crimsonMat = new THREE.MeshBasicMaterial({ color: 0xFF1744 });
        const purpleMat = new THREE.MeshBasicMaterial({ color: 0x9D00FF });

        const scale = this.type === 'finalboss' ? 1.7 : (this.type === 'miniboss' ? 1.4 : 1.0);

        const root = new THREE.Group();
        this.group.add(root);
        this.bones.root = root;

        const pelvis = new THREE.Group();
        pelvis.position.y = 0.9 * scale;
        root.add(pelvis);
        this.bones.pelvis = pelvis;

        const torso = new THREE.Group();
        pelvis.add(torso);
        this.bones.torso = torso;

        const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26 * scale, 0.2 * scale, 0.45 * scale, 8), armorMat);
        torsoMesh.position.y = 0.22 * scale;
        torsoMesh.castShadow = true;
        torso.add(torsoMesh);

        // Head
        const head = new THREE.Group();
        head.position.y = 0.5 * scale;
        torso.add(head);
        this.bones.head = head;

        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 8, 8), shadowMat);
        headMesh.position.y = 0.1 * scale;
        head.add(headMesh);

        // Glowing Eyes
        [-0.06 * scale, 0.06 * scale].forEach(x => {
            const eye = new THREE.Mesh(new THREE.BoxGeometry(0.04 * scale, 0.02 * scale, 0.02 * scale), this.type === 'finalboss' ? purpleMat : crimsonMat);
            eye.position.set(x, 0.12 * scale, 0.16 * scale);
            head.add(eye);
        });

        // Horns / Wings
        if (this.type === 'finalboss') {
            const hornGeo = new THREE.ConeGeometry(0.06 * scale, 0.45 * scale, 4);
            const lHorn = new THREE.Mesh(hornGeo, armorMat);
            lHorn.position.set(-0.16 * scale, 0.32 * scale, 0);
            lHorn.rotation.set(-0.2, 0, 0.6);
            const rHorn = new THREE.Mesh(hornGeo, armorMat);
            rHorn.position.set(0.16 * scale, 0.32 * scale, 0);
            rHorn.rotation.set(-0.2, 0, -0.6);
            head.add(lHorn);
            head.add(rHorn);

            // Raizen Demonic Wings
            const wingGeo = new THREE.BoxGeometry(0.9, 1.6, 0.02);
            const lWing = new THREE.Mesh(wingGeo, purpleMat);
            lWing.position.set(-0.8, 0.5, -0.3);
            lWing.rotation.set(0.2, 0.4, 0.4);
            const rWing = new THREE.Mesh(wingGeo, purpleMat);
            rWing.position.set(0.8, 0.5, -0.3);
            rWing.rotation.set(0.2, -0.4, -0.4);
            torso.add(lWing);
            torso.add(rWing);
            this.bones.lWing = lWing;
            this.bones.rWing = rWing;
        }

        // Arms & Weapons
        this.bones.leftArm = new THREE.Group();
        this.bones.leftArm.position.set(-0.3 * scale, 0.38 * scale, 0);
        torso.add(this.bones.leftArm);
        const lMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * scale, 0.05 * scale, 0.45 * scale, 6), shadowMat);
        lMesh.position.y = -0.22 * scale;
        this.bones.leftArm.add(lMesh);

        this.bones.rightArm = new THREE.Group();
        this.bones.rightArm.position.set(0.3 * scale, 0.38 * scale, 0);
        torso.add(this.bones.rightArm);
        const rMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * scale, 0.05 * scale, 0.45 * scale, 6), shadowMat);
        rMesh.position.y = -0.22 * scale;
        this.bones.rightArm.add(rMesh);

        // Weapon
        if (this.type === 'finalboss') {
            const greatsword = new THREE.Mesh(new THREE.BoxGeometry(0.09 * scale, 2.0 * scale, 0.03 * scale), purpleMat);
            greatsword.position.set(0, -0.4 * scale, 0.6 * scale);
            greatsword.rotation.x = -Math.PI / 2;
            this.bones.rightArm.add(greatsword);
        } else if (this.type === 'miniboss') {
            const club = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.06 * scale, 1.4 * scale, 8), armorMat);
            club.position.set(0, -0.4 * scale, 0.4 * scale);
            club.rotation.x = -Math.PI / 2;
            this.bones.rightArm.add(club);
        } else {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05 * scale, 1.0 * scale, 0.02 * scale), crimsonMat);
            blade.position.set(0, -0.4 * scale, 0.3 * scale);
            blade.rotation.x = -Math.PI / 2;
            this.bones.rightArm.add(blade);
        }

        // Legs
        this.bones.leftLeg = new THREE.Group();
        this.bones.leftLeg.position.set(-0.14 * scale, 0, 0);
        pelvis.add(this.bones.leftLeg);
        const llMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.06 * scale, 0.8 * scale, 6), shadowMat);
        llMesh.position.y = -0.4 * scale;
        this.bones.leftLeg.add(llMesh);

        this.bones.rightLeg = new THREE.Group();
        this.bones.rightLeg.position.set(0.14 * scale, 0, 0);
        pelvis.add(this.bones.rightLeg);
        const rlMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.06 * scale, 0.8 * scale, 6), shadowMat);
        rlMesh.position.y = -0.4 * scale;
        if (window.ultraGraphics) {
            window.ultraGraphics.applyFresnelRimToMesh(this.group, this.type === 'finalboss' ? 0x9D00FF : 0xFF1744);
        }

        this.group.position.copy(this.position);
    }

    buildUI() {
        const barGroup = new THREE.Group();
        const barHeight = this.type === 'finalboss' ? 3.0 : (this.type === 'miniboss' ? 2.6 : 2.0);
        barGroup.position.y = barHeight;
        this.group.add(barGroup);
        this.healthBarGroup = barGroup;

        // BG
        const bg = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.12), new THREE.MeshBasicMaterial({ color: 0x0A0B10, side: THREE.DoubleSide }));
        barGroup.add(bg);

        // Fill
        const fill = new THREE.Mesh(
            new THREE.PlaneGeometry(0.96, 0.08),
            new THREE.MeshBasicMaterial({ color: this.type === 'finalboss' ? 0x9D00FF : 0xFF1744, side: THREE.DoubleSide })
        );
        fill.position.z = 0.01;
        barGroup.add(fill);
        this.healthFillMesh = fill;

        // Alert
        const alertMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.35), new THREE.MeshBasicMaterial({ color: 0xFFFF00, transparent: true, opacity: 0 }));
        alertMesh.position.y = barHeight + 0.3;
        this.group.add(alertMesh);
        this.alertIcon = alertMesh;
    }

    update(dt, player, terrainHeightFn, spawnParticleFn, spawnProjectileFn, camera) {
        if (!this.isAlive) {
            this.deathTimer += dt;
            this.bones.root.position.y = -this.deathTimer * 0.4;
            if (this.deathTimer >= 1.5) this.destroy();
            return;
        }

        this.animTime += dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
        if (this.teleportCooldown > 0) this.teleportCooldown -= dt;

        // Orient UI to camera
        if (camera && this.healthBarGroup) {
            this.healthBarGroup.quaternion.copy(camera.quaternion);
            if (this.alertIcon) this.alertIcon.quaternion.copy(camera.quaternion);
        }

        const distToPlayer = this.position.distanceTo(player.position);

        // Raizen Boss Phase check
        if (this.type === 'finalboss') {
            const hpRatio = this.health / this.maxHealth;
            if (hpRatio < 0.33 && this.bossPhase < 3) {
                this.bossPhase = 3;
                this.damage = 70;
                this.speed = 7.0;
                if (spawnParticleFn) spawnParticleFn(this.position.x, this.position.y + 1.0, this.position.z, 'shockwave');
            } else if (hpRatio < 0.66 && this.bossPhase < 2) {
                this.bossPhase = 2;
                this.damage = 60;
                this.speed = 6.4;
            }

            // Raizen Phase 2 & 3 Teleportation
            if (this.bossPhase >= 2 && this.teleportCooldown <= 0 && distToPlayer > 8.0) {
                this.teleportCooldown = 6.0;
                const angle = Math.random() * Math.PI * 2;
                this.position.set(player.position.x + Math.sin(angle) * 3.0, player.position.y, player.position.z + Math.cos(angle) * 3.0);
                if (spawnParticleFn) spawnParticleFn(this.position.x, this.position.y + 1.0, this.position.z, 'shadowBurst');
            }
        }

        // AI State Machine
        if (this.state === 'PATROL') {
            if (distToPlayer <= this.detectRadius && player.isAlive && !player.isStealthed) {
                this.state = 'ALERT';
                this.alertTimer = 0.4;
                if (this.alertIcon) this.alertIcon.material.opacity = 1.0;
            } else {
                this.handlePatrol(dt);
            }
        } else if (this.state === 'ALERT') {
            this.alertTimer -= dt;
            const dir = new THREE.Vector3().subVectors(player.position, this.position);
            this.rotationY = Math.atan2(dir.x, dir.z);
            if (this.alertTimer <= 0) {
                this.state = 'CHASE';
                if (this.alertIcon) this.alertIcon.material.opacity = 0;
            }
        } else if (this.state === 'CHASE') {
            if (!player.isAlive || distToPlayer > this.detectRadius * 1.8) {
                this.state = 'PATROL';
            } else if (distToPlayer <= this.attackRange && this.attackCooldown <= 0) {
                this.state = 'ATTACK';
                this.attackTimer = 0;
                this.hasHitThisAttack = false;
            } else {
                const dir = new THREE.Vector3().subVectors(player.position, this.position);
                dir.y = 0;
                dir.normalize();
                this.position.addScaledVector(dir, this.speed * dt);
                this.rotationY = Math.atan2(dir.x, dir.z);
                this.animateWalk(dt, 1.2);
            }
        } else if (this.state === 'ATTACK') {
            this.handleAttack(dt, player, spawnParticleFn, spawnProjectileFn);
        }

        // Gravity
        this.velocity.y -= 25.0 * dt;
        this.position.y += this.velocity.y * dt;
        const groundY = terrainHeightFn ? terrainHeightFn(this.position.x, this.position.z) : 0;
        if (this.position.y <= groundY) {
            this.position.y = groundY;
            this.velocity.y = 0;
        }

        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotationY;

        // Boss Wings Flap
        if (this.bones.lWing && this.bones.rWing) {
            const flap = Math.sin(this.animTime * 5) * 0.2;
            this.bones.lWing.rotation.y = 0.4 + flap;
            this.bones.rWing.rotation.y = -0.4 - flap;
        }
    }

    handlePatrol(dt) {
        if (!this.waypoints || this.waypoints.length === 0) {
            this.animateIdle(dt);
            return;
        }
        const targetWp = this.waypoints[this.currentWaypointIdx];
        const dir = new THREE.Vector3(targetWp[0] - this.position.x, 0, targetWp[2] - this.position.z);
        const dist = dir.length();

        if (dist < 0.6) {
            this.patrolWaitTimer += dt;
            this.animateIdle(dt);
            if (this.patrolWaitTimer > 2.0) {
                this.patrolWaitTimer = 0;
                this.currentWaypointIdx = (this.currentWaypointIdx + 1) % this.waypoints.length;
            }
        } else {
            dir.normalize();
            this.position.addScaledVector(dir, this.speed * 0.5 * dt);
            this.rotationY = Math.atan2(dir.x, dir.z);
            this.animateWalk(dt, 0.6);
        }
    }

    handleAttack(dt, player, spawnParticleFn, spawnProjectileFn) {
        this.attackTimer += dt;

        if (this.attackTimer < 0.45) {
            this.bones.rightArm.rotation.set(-1.8, 0, 0.4);
        } else if (this.attackTimer >= 0.45 && this.attackTimer < 0.7) {
            this.bones.rightArm.rotation.set(0.6, 0, -0.2);

            if (!this.hasHitThisAttack && this.attackTimer >= 0.5) {
                this.hasHitThisAttack = true;

                if (this.type === 'spellcaster') {
                    const fwd = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));
                    if (spawnProjectileFn) {
                        spawnProjectileFn(
                            new THREE.Vector3().copy(this.position).add(new THREE.Vector3(0, 1.2, 0)),
                            fwd,
                            'shadowBolt',
                            this.damage
                        );
                    }
                } else {
                    const dist = this.position.distanceTo(player.position);
                    if (dist <= this.attackRange + 0.8) {
                        player.takeDamage(this.damage);
                        if (spawnParticleFn) {
                            spawnParticleFn(player.position.x, player.position.y + 1.0, player.position.z, 'hitSpark');
                        }
                    }
                }

                if (this.type === 'miniboss' || this.type === 'finalboss') {
                    if (spawnParticleFn) spawnParticleFn(this.position.x, this.position.y + 0.1, this.position.z, 'shockwave');
                }
            }
        } else {
            this.state = 'CHASE';
            this.attackCooldown = this.attackCooldownMax;
            this.hasHitThisAttack = false;
            this.bones.rightArm.rotation.set(0, 0, 0);
        }
    }

    animateIdle(dt) {
        this.bones.torso.position.y = Math.sin(this.animTime * 2) * 0.02;
    }

    animateWalk(dt, mult) {
        const t = this.animTime * 10 * mult;
        this.bones.leftLeg.rotation.x = Math.sin(t) * 0.7;
        this.bones.rightLeg.rotation.x = -Math.sin(t) * 0.7;
    }

    takeDamage(amount, knockback, isHeavy) {
        if (!this.isAlive) return;
        this.health = Math.max(0, this.health - amount);
        this.state = 'CHASE';

        if (knockback && this.type !== 'finalboss') {
            this.position.addScaledVector(knockback, 0.12);
        }

        const pct = Math.max(0, this.health / this.maxHealth);
        if (this.healthFillMesh) {
            this.healthFillMesh.scale.x = pct;
            this.healthFillMesh.position.x = -0.48 * (1 - pct);
        }

        if (this.health <= 0) {
            this.isAlive = false;
            this.state = 'DEAD';
            if (this.healthBarGroup) this.healthBarGroup.visible = false;
            if (this.alertIcon) this.alertIcon.visible = false;
        }
    }

    destroy() {
        this.scene.remove(this.group);
    }
}

window.Enemy = Enemy;
