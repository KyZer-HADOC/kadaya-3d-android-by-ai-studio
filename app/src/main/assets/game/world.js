// 3D World Manager with Ultra Graphics PBR Shading, Foliage & Atmosphere
// For KADAYA: THE LAST SHADOW - Built with Three.js

class WorldManager {
    constructor(scene) {
        this.scene = scene;
        this.levelObjects = [];
        this.lights = [];
        this.particles = [];
        this.projectiles = [];
        this.currentMissionData = null;
        this.terrainHeight = (x, z) => 0;

        this.initMaterials();
    }

    initMaterials() {
        const ug = window.ultraGraphics;

        this.mats = {
            stone: new THREE.MeshStandardMaterial({
                map: ug.textures.stoneColor,
                normalMap: ug.textures.stoneNormal,
                roughnessMap: ug.textures.stoneRoughness,
                roughness: 0.65,
                metalness: 0.15
            }),
            darkStone: new THREE.MeshStandardMaterial({
                map: ug.textures.stoneColor,
                normalMap: ug.textures.stoneNormal,
                roughnessMap: ug.textures.stoneRoughness,
                color: 0x616161,
                roughness: 0.7,
                metalness: 0.25
            }),
            wood: new THREE.MeshStandardMaterial({
                map: ug.textures.woodColor,
                normalMap: ug.textures.woodNormal,
                roughness: 0.6,
                metalness: 0.1
            }),
            vermilion: new THREE.MeshStandardMaterial({
                color: 0xD32F2F,
                map: ug.textures.woodColor,
                normalMap: ug.textures.woodNormal,
                roughness: 0.45,
                metalness: 0.2
            }),
            goldTrim: new THREE.MeshStandardMaterial({
                color: 0xFFD700,
                roughness: 0.25,
                metalness: 0.9,
                emissive: 0xFFA000,
                emissiveIntensity: 0.15
            }),
            roofTile: new THREE.MeshStandardMaterial({
                color: 0x1A1C22,
                map: ug.textures.stoneColor,
                normalMap: ug.textures.stoneNormal,
                roughness: 0.5,
                metalness: 0.3
            }),
            leafGreen: new THREE.MeshStandardMaterial({
                color: 0x1B5E20,
                roughness: 0.75,
                metalness: 0.1
            }),
            sakuraPink: new THREE.MeshStandardMaterial({
                color: 0xF48FB1,
                roughness: 0.6,
                emissive: 0xE91E63,
                emissiveIntensity: 0.12
            }),
            tombstone: new THREE.MeshStandardMaterial({
                map: ug.textures.stoneColor,
                normalMap: ug.textures.stoneNormal,
                color: 0x546E7A,
                roughness: 0.85,
                metalness: 0.1
            }),
            volcanicRock: new THREE.MeshStandardMaterial({
                map: ug.textures.basaltColor,
                normalMap: ug.textures.basaltNormal,
                roughness: 0.85,
                metalness: 0.25
            }),
            lavaGlow: new THREE.MeshStandardMaterial({
                map: ug.textures.lavaEmission,
                emissiveMap: ug.textures.lavaEmission,
                color: 0xFF5722,
                emissive: 0xFF3D00,
                emissiveIntensity: 1.8,
                roughness: 0.3
            }),
            lanternWarm: new THREE.MeshBasicMaterial({
                color: 0xFFD54F
            }),
            lanternGhost: new THREE.MeshBasicMaterial({
                color: 0x00E5FF
            }),
            waterPuddle: new THREE.MeshStandardMaterial({
                color: 0x0D1B2A,
                roughness: 0.05,
                metalness: 0.85,
                transparent: true,
                opacity: 0.85
            })
        };
    }

    loadMission(missionId) {
        const mission = window.KADAYA_DATA.missions.find(m => m.id === missionId) || window.KADAYA_DATA.missions[0];
        this.currentMissionData = mission;

        // Clear previous
        this.levelObjects.forEach(obj => this.scene.remove(obj));
        this.levelObjects = [];
        this.lights.forEach(l => this.scene.remove(l));
        this.lights = [];
        this.projectiles.forEach(p => this.scene.remove(p.mesh));
        this.projectiles = [];
        window.ultraGraphics.flickerLights = [];

        const mapConfig = window.KADAYA_DATA.maps.find(m => m.id === mission.mapId) || window.KADAYA_DATA.maps[0];

        // Atmospheric Depth Fog
        this.scene.fog = new THREE.FogExp2(mapConfig.fogColor, 0.016);

        // Directional Moonlight / Starlight with Ultra Shadows
        const dirLight = new THREE.DirectionalLight(mapConfig.lightColor, 1.4);
        dirLight.position.set(30, 55, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 180;
        dirLight.shadow.camera.left = -45;
        dirLight.shadow.camera.right = 45;
        dirLight.shadow.camera.top = 45;
        dirLight.shadow.camera.bottom = -45;
        dirLight.shadow.bias = -0.0004;
        this.scene.add(dirLight);
        this.lights.push(dirLight);

        // Rich Hemisphere Lighting (Sky tone + Ground bounce reflection)
        const hemiLight = new THREE.HemisphereLight(
            mapConfig.lightColor,
            mapConfig.ambientColor,
            0.85
        );
        this.scene.add(hemiLight);
        this.lights.push(hemiLight);

        // 1. Build Ultra Celestial Sky & 360 Mountain Ridge
        const skyGroup = window.ultraGraphics.buildUltraCelestialSky(this.scene, mapConfig.theme, mapConfig);
        this.levelObjects.push(skyGroup);

        // 2. Build Volumetric God Rays & Ground Fog
        const volGroup = window.ultraGraphics.buildVolumetricAtmosphere(this.scene, mapConfig.theme);
        this.levelObjects.push(volGroup);

        // 3. Build Ambient Particle Field (Sakura petals / Wisps / Embers)
        const partGroup = window.ultraGraphics.buildAmbientParticleSystem(this.scene, mapConfig.theme);
        this.levelObjects.push(partGroup);

        // 4. Build Environment Ground & Architecture Theme
        if (mapConfig.theme === 'forest') {
            this.buildForestEnvironment();
        } else if (mapConfig.theme === 'graveyard') {
            this.buildGraveyardEnvironment();
        } else {
            this.buildTempleEnvironment();
        }

        // 5. Build 3D Instanced Foliage (Grass Field)
        const grassGroup = window.ultraGraphics.buildUltraFoliageGrass(this.scene, 200, 36);
        this.levelObjects.push(grassGroup);

        // 6. Objective Pedestal
        this.createObjectivePedestal(mission.targetPos[0], mission.targetPos[2], mapConfig.lightColor);

        return mission;
    }

    buildForestEnvironment() {
        // Ultra Textured Ground with Normal and Roughness
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(130, 140).rotateX(-Math.PI / 2),
            new THREE.MeshStandardMaterial({
                color: 0x132117,
                map: window.ultraGraphics.textures.stoneColor,
                normalMap: window.ultraGraphics.textures.stoneNormal,
                roughness: 0.85,
                metalness: 0.1
            })
        );
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.levelObjects.push(ground);

        // Cobblestone Sanctuary Path with Normal Map & Puddle reflections
        const path = new THREE.Mesh(
            new THREE.PlaneGeometry(5.4, 80).rotateX(-Math.PI / 2),
            this.mats.stone
        );
        path.position.set(0, 0.02, -5);
        path.receiveShadow = true;
        this.scene.add(path);
        this.levelObjects.push(path);

        // Reflective Water Puddles catching moonlight
        [[-1.2, 8], [1.1, -4], [-0.8, -18]].forEach(([px, pz]) => {
            const puddle = new THREE.Mesh(
                new THREE.CircleGeometry(1.6 + Math.random() * 0.8, 16).rotateX(-Math.PI / 2),
                this.mats.waterPuddle
            );
            puddle.position.set(px, 0.03, pz);
            this.scene.add(puddle);
            this.levelObjects.push(puddle);
        });

        // Grand Torii Gates with lacquered vermilion, black copper caps & shimenawa ropes
        this.createUltraToriiGate(0, 18, 1.25);
        this.createUltraToriiGate(0, -10, 1.05);

        // Stone Toro Lanterns along the path with dynamic warm flickering flame
        [-3.4, 3.4].forEach(x => {
            for (let z = 16; z >= -28; z -= 14) {
                this.createUltraStoneLantern(x, z, false);
            }
        });

        // Sakura Trees with multi-tier canopies and hanging lanterns
        [[-9, 12], [10, 10], [-11, 0], [12, -2], [-10, -16], [11, -18]].forEach(([x, z]) => {
            this.createUltraSakuraTree(x, z);
        });

        // Surrounding Pine Trees
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const dist = 32 + Math.random() * 14;
            this.createUltraPineTree(Math.sin(angle) * dist, Math.cos(angle) * dist);
        }

        // Shinto Shrine Gazebo / Rest Area
        this.createShrinePavilion(-14, -8);
    }

    buildGraveyardEnvironment() {
        // Dark Soil Ground with Normal Map
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(130, 140).rotateX(-Math.PI / 2),
            new THREE.MeshStandardMaterial({
                color: 0x0A0F16,
                map: window.ultraGraphics.textures.stoneColor,
                normalMap: window.ultraGraphics.textures.stoneNormal,
                roughness: 0.9,
                metalness: 0.15
            })
        );
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.levelObjects.push(ground);

        // Stone Crypt Path
        const path = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 80).rotateX(-Math.PI / 2),
            this.mats.darkStone
        );
        path.position.set(0, 0.02, -5);
        path.receiveShadow = true;
        this.scene.add(path);
        this.levelObjects.push(path);

        // Crypt Pillars & Mausoleums with Cyan Ghost Lanterns
        for (let z = 16; z >= -30; z -= 12) {
            this.createCryptPillar(-7.5, z);
            this.createCryptPillar(7.5, z);
            this.createUltraStoneLantern(-3.4, z, true);
            this.createUltraStoneLantern(3.4, z, true);
        }

        // Tombstones scattered around
        for (let i = 0; i < 40; i++) {
            const x = (Math.random() > 0.5 ? 1 : -1) * (5.5 + Math.random() * 20);
            const z = (Math.random() - 0.5) * 65;
            this.createUltraTombstone(x, z);
        }

        // Skeletal Gnarled Trees
        [[-13, 10], [15, 8], [-15, -10], [13, -14], [-13, -26], [15, -28]].forEach(([x, z]) => {
            this.createDeadTree(x, z);
        });

        // Mausoleum Tomb at the deep end
        this.createMausoleum(0, -34);
    }

    buildTempleEnvironment() {
        // Volcanic Basalt Courtyard
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(130, 140).rotateX(-Math.PI / 2),
            this.mats.volcanicRock
        );
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.levelObjects.push(ground);

        // Glowing Molten Lava Rivers
        [-6.5, 6.5].forEach(lx => {
            const lava = new THREE.Mesh(
                new THREE.PlaneGeometry(2.2, 75).rotateX(-Math.PI / 2),
                this.mats.lavaGlow
            );
            lava.position.set(lx, 0.04, -5);
            this.scene.add(lava);
            this.levelObjects.push(lava);

            // Add dynamic fiery point lights along the lava river
            [-20, 0, 15].forEach(lz => {
                const fireLight = new THREE.PointLight(0xFF3D00, 1.2, 12);
                fireLight.position.set(lx, 1.5, lz);
                this.scene.add(fireLight);
                this.lights.push(fireLight);
                window.ultraGraphics.registerFlickerLight(fireLight, 1.2, 0xFF3D00);
            });
        });

        // Obsidian Temple Pillars
        for (let z = 18; z >= -30; z -= 10) {
            this.createCryptPillar(-9.5, z);
            this.createCryptPillar(9.5, z);
            this.createUltraStoneLantern(-4.0, z, false);
            this.createUltraStoneLantern(4.0, z, false);
        }

        // Ultra Grand Pagoda Shrine at end
        this.createUltraPagoda(0, -34);
    }

    // 1. Ultra Torii Gate with lacquered vermilion and sacred Shimenawa rope
    createUltraToriiGate(x, z, scale = 1.0) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        group.scale.set(scale, scale, scale);

        [-2.6, 2.6].forEach(px => {
            // Main Pillars
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 5.8, 12), this.mats.vermilion);
            pillar.position.set(px, 2.9, 0);
            pillar.castShadow = true;
            group.add(pillar);

            // Stone Pedestal base (kamebara)
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 0.5, 12), this.mats.darkStone);
            base.position.set(px, 0.25, 0);
            base.castShadow = true;
            group.add(base);

            // Black copper top collar
            const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.3, 12), this.mats.roofTile);
            collar.position.set(px, 5.0, 0);
            group.add(collar);
        });

        // Kasagi (Top curved lintel)
        const kasagi = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.42, 0.55), this.mats.vermilion);
        kasagi.position.set(0, 5.6, 0);
        kasagi.castShadow = true;
        group.add(kasagi);

        // Black curved eaves cap
        const eaveCap = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.12, 0.65), this.mats.roofTile);
        eaveCap.position.set(0, 5.85, 0);
        group.add(eaveCap);

        // Nuki (Lower crossbar)
        const nuki = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 0.38), this.mats.vermilion);
        nuki.position.set(0, 4.6, 0);
        nuki.castShadow = true;
        group.add(nuki);

        // Gakuzuka (Center tablet)
        const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.2), this.mats.goldTrim);
        tablet.position.set(0, 5.1, 0);
        group.add(tablet);

        // Sacred Straw Shimenawa Rope hanging across
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.0, 8), this.mats.wood);
        rope.position.set(0, 4.3, 0);
        rope.rotation.z = Math.PI / 2;
        group.add(rope);

        // White paper Shide charms hanging from rope
        [-1.4, 0, 1.4].forEach(sx => {
            const shide = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 0.02), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
            shide.position.set(sx, 3.9, 0);
            group.add(shide);
        });

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    // 2. Ultra Stone Lantern (Toro) with realistic carved roof, lattice window, and flickering flame
    createUltraStoneLantern(x, z, isGhost = false) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Base foundation (kiso)
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.35, 6), this.mats.darkStone);
        base.position.y = 0.18;
        base.castShadow = true;
        group.add(base);

        // Carved Column post (sao)
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 1.4, 6), this.mats.stone);
        post.position.y = 1.0;
        post.castShadow = true;
        group.add(post);

        // Middle platform (chudai)
        const chudai = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.35, 0.25, 6), this.mats.darkStone);
        chudai.position.y = 1.8;
        group.add(chudai);

        // Fire chamber lattice (hibukuro)
        const fireBox = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.52), isGhost ? this.mats.lanternGhost : this.mats.lanternWarm);
        fireBox.position.y = 2.15;
        group.add(fireBox);

        // Carved hexagonal roof (kasa)
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.45, 6), this.mats.roofTile);
        roof.position.y = 2.6;
        roof.castShadow = true;
        group.add(roof);

        // Top finial jewel (hoju)
        const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), this.mats.goldTrim);
        jewel.position.y = 2.9;
        group.add(jewel);

        // Dynamic Real-time Point Light with flicker
        const lightColor = isGhost ? 0x00E5FF : 0xFFA000;
        const pLight = new THREE.PointLight(lightColor, 1.3, 9.0);
        pLight.position.set(0, 2.15, 0);
        group.add(pLight);
        this.lights.push(pLight);

        window.ultraGraphics.registerFlickerLight(pLight, 1.3, lightColor);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    // 3. Ultra Sakura Tree with branched canopies and hanging lanterns
    createUltraSakuraTree(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Trunk with gnarled natural lean
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.65, 5.5, 10), this.mats.wood);
        trunk.position.y = 2.75;
        trunk.rotation.z = (Math.random() - 0.5) * 0.15;
        trunk.castShadow = true;
        group.add(trunk);

        // Major boughs
        [-1.2, 1.2].forEach((bx, idx) => {
            const bough = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 3.2, 8), this.mats.wood);
            bough.position.set(bx, 4.4, 0);
            bough.rotation.z = (idx === 0 ? 0.45 : -0.45);
            bough.castShadow = true;
            group.add(bough);
        });

        // Layered Blossom Canopies (Multi-cluster cloud volume)
        [
            [0, 5.8, 0, 2.5],
            [-1.8, 5.2, 0.8, 1.9],
            [1.8, 5.4, -0.6, 2.0],
            [0, 6.8, -0.5, 1.6]
        ].forEach(([cx, cy, cz, cr]) => {
            const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 1), this.mats.sakuraPink);
            puff.position.set(cx, cy, cz);
            puff.castShadow = true;
            group.add(puff);
        });

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    // 4. Ultra Pine Tree with detailed tiered needle-cone canopies
    createUltraPineTree(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.55, 7.5, 8), this.mats.wood);
        trunk.position.y = 3.75;
        trunk.castShadow = true;
        group.add(trunk);

        // 4 needle canopy tiers
        [3.6, 5.2, 6.8, 8.2].forEach((y, i) => {
            const cone = new THREE.Mesh(new THREE.ConeGeometry(3.0 - i * 0.6, 2.6, 8), this.mats.leafGreen);
            cone.position.y = y;
            cone.castShadow = true;
            group.add(cone);
        });

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    createDeadTree(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.45, 6.0, 7), this.mats.wood);
        trunk.position.y = 3.0;
        trunk.rotation.z = (Math.random() - 0.5) * 0.35;
        trunk.castShadow = true;
        group.add(trunk);

        // Twisted branch
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.8, 6), this.mats.wood);
        branch.position.set(0.6, 4.6, 0);
        branch.rotation.z = 0.6;
        group.add(branch);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    createUltraTombstone(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Base slab
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.6), this.mats.darkStone);
        base.position.y = 0.12;
        group.add(base);

        // Carved Vertical Stele (with kanji rune)
        const stone = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.2, 0.28), this.mats.tombstone);
        stone.position.y = 0.75;
        stone.rotation.y = (Math.random() - 0.5) * 0.4;
        stone.castShadow = true;
        group.add(stone);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    createCryptPillar(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.6, 8), this.mats.darkStone);
        base.position.y = 0.3;
        base.castShadow = true;
        group.add(base);

        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 7.0, 8), this.mats.darkStone);
        pillar.position.y = 3.8;
        pillar.castShadow = true;
        group.add(pillar);

        const capital = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.6), this.mats.roofTile);
        capital.position.y = 7.4;
        group.add(capital);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    // 5. Ultra Pagoda with curved eave roofs and ceremonial braziers
    createUltraPagoda(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Stone Foundation Courtyard
        const base = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 10), this.mats.darkStone);
        base.position.y = 0.7;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // 3 Tiers of Pagoda Architecture
        [1.4, 4.4, 7.2].forEach((tierY, idx) => {
            const scale = 1.0 - idx * 0.22;
            const walls = new THREE.Mesh(new THREE.BoxGeometry(6.2 * scale, 2.2 * scale, 6.2 * scale), this.mats.vermilion);
            walls.position.y = tierY + 1.1 * scale;
            walls.castShadow = true;
            group.add(walls);

            // Flared eaves curved roof
            const roof = new THREE.Mesh(new THREE.ConeGeometry(5.2 * scale, 1.4 * scale, 4), this.mats.roofTile);
            roof.position.y = tierY + 2.4 * scale;
            roof.rotation.y = Math.PI / 4;
            roof.castShadow = true;
            group.add(roof);
        });

        // Spire pinnacle (sorin)
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 3.2, 8), this.mats.goldTrim);
        spire.position.y = 10.8;
        group.add(spire);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    createShrinePavilion(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const deck = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 5), this.mats.wood);
        deck.position.y = 0.2;
        group.add(deck);

        [-1.8, 1.8].forEach(px => {
            [-1.8, 1.8].forEach(pz => {
                const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.2, 8), this.mats.vermilion);
                post.position.set(px, 1.8, pz);
                group.add(post);
            });
        });

        const roof = new THREE.Mesh(new THREE.ConeGeometry(4.2, 1.4, 4), this.mats.roofTile);
        roof.position.y = 4.0;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    createMausoleum(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const crypt = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 7), this.mats.darkStone);
        crypt.position.y = 2.25;
        crypt.castShadow = true;
        group.add(crypt);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(6.5, 2.0, 4), this.mats.roofTile);
        roof.position.y = 5.2;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    createObjectivePedestal(x, z, glowHex) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const stone = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 0.9, 10), this.mats.darkStone);
        stone.position.y = 0.45;
        stone.castShadow = true;
        group.add(stone);

        // Mystical Inscribed Scroll with Golden Rods
        const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.95, 10), new THREE.MeshStandardMaterial({
            color: glowHex,
            emissive: glowHex,
            emissiveIntensity: 0.9,
            roughness: 0.2
        }));
        scroll.position.y = 1.6;
        scroll.rotation.z = Math.PI / 4;
        group.add(scroll);
        this.rotatingArtifact = scroll;

        // Volumetric Light Pillar
        const lightPillar = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.2, 18, 16, 1, true),
            new THREE.MeshBasicMaterial({
                color: glowHex,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            })
        );
        lightPillar.position.y = 9;
        group.add(lightPillar);

        // Ground Rune Circle
        const runeCircle = new THREE.Mesh(
            new THREE.RingGeometry(1.4, 2.2, 32),
            new THREE.MeshBasicMaterial({
                color: glowHex,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            })
        );
        runeCircle.rotation.x = -Math.PI / 2;
        runeCircle.position.y = 0.05;
        group.add(runeCircle);

        this.scene.add(group);
        this.levelObjects.push(group);
    }

    spawnParticle(x, y, z, type) {
        const count = type === 'shockwave' ? 1 : (type === 'hitSpark' ? 12 : 8);
        for (let i = 0; i < count; i++) {
            let color = 0x00E5FF;
            let size = 0.18;
            let life = 0.45;
            let vel = new THREE.Vector3((Math.random() - 0.5) * 5, Math.random() * 4, (Math.random() - 0.5) * 5);

            if (type === 'hitSpark') {
                color = 0xFFEA00;
                size = 0.14;
                life = 0.35;
                vel = new THREE.Vector3((Math.random() - 0.5) * 8, Math.random() * 6, (Math.random() - 0.5) * 8);
            } else if (type === 'shadowBurst') {
                color = 0x2A0845;
                size = 0.32;
                life = 0.55;
            } else if (type === 'chakraSpiral') {
                color = 0x9D00FF;
                size = 0.22;
            }

            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(size, size, size),
                new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
            );
            mesh.position.set(x, y, z);
            this.scene.add(mesh);
            this.particles.push({ mesh, vel, life, maxLife: life, type });
        }
    }

    spawnProjectile(origin, direction, type, damage) {
        const geo = type === 'shuriken' ? new THREE.CylinderGeometry(0.28, 0.28, 0.025, 4) : new THREE.SphereGeometry(0.35, 10, 10);
        const mat = new THREE.MeshStandardMaterial({
            color: type === 'shuriken' ? 0xE0E0E0 : 0x9D00FF,
            emissive: type === 'shuriken' ? 0x616161 : 0x9D00FF,
            emissiveIntensity: 0.5
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(origin);
        mesh.rotation.y = Math.atan2(direction.x, direction.z);
        this.scene.add(mesh);

        this.projectiles.push({
            mesh: mesh,
            dir: direction.clone().normalize(),
            speed: 26.0,
            type: type,
            damage: damage,
            life: 2.4
        });
    }

    update(dt, player, enemies) {
        if (this.rotatingArtifact) {
            this.rotatingArtifact.rotation.y += dt * 2.2;
        }

        // Animate Ultra Graphics system (wind, sways, particles, flickering lanterns)
        if (window.ultraGraphics) {
            window.ultraGraphics.update(dt);
        }

        // Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.life -= dt;
            p.mesh.position.addScaledVector(p.dir, p.speed * dt);

            if (p.type === 'shuriken') {
                p.mesh.rotation.y += dt * 25;
                if (enemies) {
                    enemies.forEach(e => {
                        if (e.isAlive && e.position.distanceTo(p.mesh.position) < 1.8) {
                            e.takeDamage(p.damage, p.dir.clone().multiplyScalar(5.0), false);
                            p.life = 0;
                            this.spawnParticle(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 'hitSpark');
                        }
                    });
                }
            } else if (p.type === 'shadowBolt') {
                if (player && player.isAlive && player.position.distanceTo(p.mesh.position) < 1.4) {
                    player.takeDamage(p.damage);
                    p.life = 0;
                    this.spawnParticle(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 'hitSpark');
                }
            }

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                this.projectiles.splice(i, 1);
            }
        }

        // Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.life -= dt;
            pt.mesh.position.addScaledVector(pt.vel, dt);
            pt.mesh.material.opacity = (pt.life / pt.maxLife) * 0.95;

            if (pt.life <= 0) {
                this.scene.remove(pt.mesh);
                this.particles.splice(i, 1);
            }
        }
    }
}

window.WorldManager = WorldManager;
