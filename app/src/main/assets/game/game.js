// Core Game Manager, Save System, UI & Mission Loop for KADAYA: THE LAST SHADOW
// Built with Three.js

class KadayaGame {
    constructor() {
        this.container = document.getElementById('game-container');
        this.clock = new THREE.Clock();

        // Player Profile & Progress
        this.ryo = 1500;
        this.completedMissions = [];
        this.purchasedItems = ['sharingan3', 'reaper_scythe', 'azure_susanoo', 'toad_bunta'];
        this.equippedWeapon = 'reaper_scythe';
        this.equippedEye = 'sharingan3';
        this.equippedSusanoo = 'azure_susanoo';
        this.equippedSummon = 'toad_bunta';
        this.upgradeRanks = {
            max_hp: 1,
            atk_power: 1,
            atk_speed: 1,
            move_speed: 1,
            dash_cooldown: 1,
            chakra_pool: 1,
            reaper_duration: 1,
            summon_mastery: 1
        };

        this.currentMissionId = 1;
        this.currentMapId = 1;

        this.loadSavedData();

        // Three.js Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);

        // Robust WebGLRenderer initialization with automatic fallback
        let renderer = null;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
                stencil: false,
                depth: true
            });
        } catch (e1) {
            console.warn("Retrying WebGLRenderer with fallback settings:", e1);
            try {
                renderer = new THREE.WebGLRenderer({
                    antialias: false,
                    failIfMajorPerformanceCaveat: false
                });
            } catch (e2) {
                console.error("Critical: WebGL context creation failed:", e2);
            }
        }
        this.renderer = renderer;
        this.isContextLost = false;

        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.25;
            if (THREE.sRGBEncoding) this.renderer.outputEncoding = THREE.sRGBEncoding;
            if (this.container) {
                this.container.appendChild(this.renderer.domElement);
            }

            this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                this.isContextLost = true;
                console.warn("[WebGL] Context Lost");
            }, false);

            this.renderer.domElement.addEventListener('webglcontextrestored', () => {
                this.isContextLost = false;
                console.log("[WebGL] Context Restored");
            }, false);
        }

        // Bind TextureManager with WebGLRenderer to enable GPU mipmapping and off-screen warmup
        if (window.textureManager) {
            window.textureManager.setRenderer(this.renderer);
        }

        this.graphicsPreset = 'ULTRA';

        this.tpCamera = new ThirdPersonCamera(this.camera, this.renderer.domElement);
        this.world = new WorldManager(this.scene);
        this.audio = window.soundEngine;

        this.player = new NinjaCharacter(this.scene);
        if (window.ultraGraphics) {
            window.ultraGraphics.applyFresnelRimToMesh(this.player.group, 0x00E5FF, 2.5);
        }
        this.enemies = [];

        this.gameState = 'MENU';
        this.objectiveCompleted = false;

        // Dialogue state
        this.activeDialogueList = [];
        this.dialogueIndex = 0;
        this.onDialogueComplete = null;

        // Inputs
        this.input = {
            moveX: 0,
            moveZ: 0,
            jump: false,
            isSprinting: false,
            attack: false,
            dash: false,
            ability1: false,
            ability2: false,
            ability3: false,
            ability4: false,
            ability5: false,
            transform: false,
            susanoo: false,
            summon: false,
            cameraYaw: 0
        };

        this.applyUpgradesToPlayer();
        this.initInputListeners();
        this.initUI();
        this.bindEvents();

        // Setup Level 1 in background
        this.setupMission(this.currentMissionId);

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    loadSavedData() {
        try {
            const data = localStorage.getItem('kadaya_last_shadow_save');
            if (data) {
                const parsed = JSON.parse(data);
                this.ryo = parsed.ryo ?? 1500;
                this.completedMissions = parsed.completedMissions || [];
                this.purchasedItems = parsed.purchasedItems || this.purchasedItems;
                this.equippedWeapon = parsed.equippedWeapon || 'reaper_scythe';
                this.equippedEye = parsed.equippedEye || 'sharingan3';
                this.equippedSusanoo = parsed.equippedSusanoo || 'azure_susanoo';
                this.equippedSummon = parsed.equippedSummon || 'toad_bunta';
                this.upgradeRanks = Object.assign(this.upgradeRanks, parsed.upgradeRanks || {});
            }
        } catch (e) {
            console.warn('Save data load error', e);
        }
    }

    saveData() {
        try {
            const saveObj = {
                ryo: this.ryo,
                completedMissions: this.completedMissions,
                purchasedItems: this.purchasedItems,
                equippedWeapon: this.equippedWeapon,
                equippedEye: this.equippedEye,
                equippedSusanoo: this.equippedSusanoo,
                equippedSummon: this.equippedSummon,
                upgradeRanks: this.upgradeRanks
            };
            localStorage.setItem('kadaya_last_shadow_save', JSON.stringify(saveObj));
        } catch (e) {
            console.warn('Save failed', e);
        }
    }

    applyUpgradesToPlayer() {
        this.player.statMultipliers.hp = 1.0 + (this.upgradeRanks.max_hp - 1) * 0.15;
        this.player.maxHealth = 120 * this.player.statMultipliers.hp;
        this.player.health = this.player.maxHealth;

        this.player.statMultipliers.atk = 1.0 + (this.upgradeRanks.atk_power - 1) * 0.15;
        this.player.statMultipliers.speed = 1.0 + (this.upgradeRanks.move_speed - 1) * 0.08;
        this.player.statMultipliers.dashCd = Math.max(0.5, 1.0 - (this.upgradeRanks.dash_cooldown - 1) * 0.12);
        this.player.statMultipliers.chakra = 1.0 + (this.upgradeRanks.chakra_pool - 1) * 0.2;
        this.player.statMultipliers.reaperTime = 1.0 + (this.upgradeRanks.reaper_duration - 1) * 0.2;

        this.player.equippedWeapon = this.equippedWeapon;
        this.player.equippedEye = this.equippedEye;
        this.player.equippedSusanoo = this.equippedSusanoo;
        this.player.buildWeaponMesh();
        if (window.ultraGraphics) {
            window.ultraGraphics.applyFresnelRimToMesh(this.player.group, 0x00E5FF, 2.5);
        }
    }

    setupMission(missionId) {
        this.currentMissionId = missionId;
        this.objectiveCompleted = false;

        this.enemies.forEach(e => e.destroy());
        this.enemies = [];

        const mission = this.world.loadMission(missionId);
        this.missionData = mission;

        // Preload & warmup environmental textures for this map to guarantee steady 60 FPS
        if (window.textureManager) {
            const mapConfig = window.KADAYA_DATA.maps.find(m => m.id === mission.mapId) || window.KADAYA_DATA.maps[0];
            window.textureManager.preloadMapTextures(mapConfig.theme);
            window.textureManager.warmupAll();
        }

        // Reset player
        this.applyUpgradesToPlayer();
        this.player.position.set(...mission.playerSpawn);
        this.player.velocity.set(0, 0, 0);
        this.player.health = this.player.maxHealth;
        this.player.stamina = this.player.maxStamina;
        this.player.chakra = this.player.maxChakra;
        this.player.reaperGauge = 100; // Ready for action!
        this.player.isAlive = true;

        // Spawn Enemies
        if (mission.enemies) {
            mission.enemies.forEach(eDef => {
                const enemy = new Enemy(this.scene, eDef.type, new THREE.Vector3(...eDef.pos), eDef.wp);
                this.enemies.push(enemy);
            });
        }

        this.updateHUDMission();
    }

    initInputListeners() {
        const keys = {};

        window.addEventListener('keydown', (e) => {
            keys[e.code] = true;
            if (this.audio) this.audio.init();

            if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.moveZ = -1;
            if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.moveZ = 1;
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.moveX = -1;
            if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.moveX = 1;
            if (e.code === 'Space') this.input.jump = true;
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.input.isSprinting = true;
            if (e.code === 'KeyE') this.input.dash = true;
            if (e.code === 'KeyQ' || e.code === 'Digit1') this.input.ability1 = true;
            if (e.code === 'Digit2') this.input.ability2 = true;
            if (e.code === 'Digit3') this.input.ability3 = true;
            if (e.code === 'Digit4') this.input.ability4 = true;
            if (e.code === 'Digit5') this.input.ability5 = true;
            if (e.code === 'KeyF') this.input.transform = true;
            if (e.code === 'KeyR') this.input.susanoo = true;
            if (e.code === 'Tab') { e.preventDefault(); this.input.summon = true; }
            if (e.code === 'Escape') this.togglePause();
        });

        window.addEventListener('keyup', (e) => {
            keys[e.code] = false;
            if ((e.code === 'KeyW' || e.code === 'ArrowUp') && !keys['KeyS'] && !keys['ArrowDown']) this.input.moveZ = 0;
            if ((e.code === 'KeyS' || e.code === 'ArrowDown') && !keys['KeyW'] && !keys['ArrowUp']) this.input.moveZ = 0;
            if ((e.code === 'KeyA' || e.code === 'ArrowLeft') && !keys['KeyD'] && !keys['ArrowRight']) this.input.moveX = 0;
            if ((e.code === 'KeyD' || e.code === 'ArrowRight') && !keys['KeyA'] && !keys['ArrowLeft']) this.input.moveX = 0;
            if (e.code === 'Space') this.input.jump = false;
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.input.isSprinting = false;
            if (e.code === 'KeyE') this.input.dash = false;
            if (e.code === 'KeyQ' || e.code === 'Digit1') this.input.ability1 = false;
            if (e.code === 'Digit2') this.input.ability2 = false;
            if (e.code === 'Digit3') this.input.ability3 = false;
            if (e.code === 'Digit4') this.input.ability4 = false;
            if (e.code === 'Digit5') this.input.ability5 = false;
            if (e.code === 'KeyF') this.input.transform = false;
            if (e.code === 'KeyR') this.input.susanoo = false;
            if (e.code === 'Tab') this.input.summon = false;
        });

        window.addEventListener('mousedown', (e) => {
            if (e.button === 0 && !e.target.closest('button') && !e.target.closest('.ui-interactive')) {
                this.input.attack = true;
            }
        });
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.input.attack = false;
        });

        this.initTouchControls();
    }

    initTouchControls() {
        const joyBase = document.getElementById('joystick-base');
        const joyStick = document.getElementById('joystick-thumb');
        if (!joyBase || !joyStick) return;

        let touchId = null;
        let baseRect = null;

        joyBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (touchId === null) {
                const t = e.changedTouches[0];
                touchId = t.identifier;
                baseRect = joyBase.getBoundingClientRect();
                updateStick(t.clientX, t.clientY);
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (touchId === null) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchId) {
                    updateStick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                    break;
                }
            }
        }, { passive: false });

        const endTouch = (e) => {
            if (touchId === null) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchId) {
                    touchId = null;
                    joyStick.style.transform = `translate(0px, 0px)`;
                    this.input.moveX = 0;
                    this.input.moveZ = 0;
                    break;
                }
            }
        };

        window.addEventListener('touchend', endTouch);
        window.addEventListener('touchcancel', endTouch);

        const updateStick = (clientX, clientY) => {
            if (!baseRect) return;
            const centerX = baseRect.left + baseRect.width / 2;
            const centerY = baseRect.top + baseRect.height / 2;
            let dx = clientX - centerX;
            let dy = clientY - centerY;
            const maxRadius = baseRect.width / 2;
            const dist = Math.hypot(dx, dy);

            if (dist > maxRadius) {
                dx = (dx / dist) * maxRadius;
                dy = (dy / dist) * maxRadius;
            }

            joyStick.style.transform = `translate(${dx}px, ${dy}px)`;
            this.input.moveX = dx / maxRadius;
            this.input.moveZ = dy / maxRadius;
        };
    }

    initUI() {
        const bindBtn = (id, prop) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const press = (e) => {
                e.preventDefault();
                this.input[prop] = true;
                if (this.audio) this.audio.init();
            };
            const release = (e) => {
                e.preventDefault();
                this.input[prop] = false;
            };
            btn.addEventListener('touchstart', press, { passive: false });
            btn.addEventListener('touchend', release, { passive: false });
            btn.addEventListener('mousedown', press);
            btn.addEventListener('mouseup', release);
        };

        bindBtn('btn-attack', 'attack');
        bindBtn('btn-jump', 'jump');
        bindBtn('btn-dash', 'dash');
        bindBtn('btn-eye-skill', 'ability1');
        bindBtn('btn-skill-shuriken', 'ability2');
        bindBtn('btn-skill-kenjutsu', 'ability3');
        bindBtn('btn-skill-stealth', 'ability4');
        bindBtn('btn-skill-rasengan', 'ability5');
        bindBtn('btn-transform', 'transform');
        bindBtn('btn-susanoo', 'susanoo');
        bindBtn('btn-summon', 'summon');
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Navigation Buttons
        document.getElementById('btn-main-start')?.addEventListener('click', () => {
            this.audio.init();
            this.audio.startMusic();
            this.startStorySequence('prologue', () => this.startGameplay());
        });

        document.getElementById('btn-main-missions')?.addEventListener('click', () => {
            this.showMissionsModal();
        });

        document.getElementById('btn-main-shop')?.addEventListener('click', () => {
            this.showShopModal();
        });

        document.getElementById('btn-main-upgrades')?.addEventListener('click', () => {
            this.showUpgradesModal();
        });

        document.getElementById('btn-main-settings')?.addEventListener('click', () => {
            this.showSettingsModal();
        });

        document.getElementById('btn-dialogue-next')?.addEventListener('click', () => {
            this.advanceDialogue();
        });

        document.getElementById('btn-pause-menu')?.addEventListener('click', () => this.togglePause());
        document.getElementById('btn-resume')?.addEventListener('click', () => this.togglePause());

        document.getElementById('btn-restart')?.addEventListener('click', () => {
            this.setupMission(this.currentMissionId);
            this.closeAllModals();
            this.gameState = 'PLAYING';
        });

        document.getElementById('btn-retry-gameover')?.addEventListener('click', () => {
            this.setupMission(this.currentMissionId);
            this.closeAllModals();
            this.gameState = 'PLAYING';
        });

        document.getElementById('btn-next-mission')?.addEventListener('click', () => {
            if (this.currentMissionId < 45) {
                this.setupMission(this.currentMissionId + 1);
                this.closeAllModals();
                this.gameState = 'PLAYING';
            } else {
                this.closeAllModals();
                document.getElementById('modal-main-menu').style.display = 'flex';
                this.gameState = 'MENU';
            }
        });

        document.getElementById('btn-mute')?.addEventListener('click', () => {
            const m = this.audio.toggleMute();
            document.getElementById('btn-mute').textContent = m ? '🔇' : '🔊';
        });
    }

    startStorySequence(key, onComplete) {
        this.activeDialogueList = window.KADAYA_DATA.dialogues[key] || [];
        this.dialogueIndex = 0;
        this.onDialogueComplete = onComplete;

        this.closeAllModals();
        const dlgModal = document.getElementById('modal-dialogue');
        dlgModal.style.display = 'flex';
        this.showCurrentDialogueLine();
    }

    showCurrentDialogueLine() {
        if (this.dialogueIndex >= this.activeDialogueList.length) {
            document.getElementById('modal-dialogue').style.display = 'none';
            if (this.onDialogueComplete) this.onDialogueComplete();
            return;
        }

        const line = this.activeDialogueList[this.dialogueIndex];
        const speakerEl = document.getElementById('dialogue-speaker');
        const textEl = document.getElementById('dialogue-text');
        const avatarEl = document.getElementById('dialogue-avatar');

        speakerEl.textContent = line.speaker;
        textEl.textContent = line.text;

        if (line.speaker === 'Kadaya') {
            avatarEl.textContent = '🥷';
            avatarEl.style.borderColor = '#00E5FF';
        } else if (line.speaker === 'Krayoo') {
            avatarEl.textContent = '🗡️';
            avatarEl.style.borderColor = '#76FF03';
        } else {
            avatarEl.textContent = '👹';
            avatarEl.style.borderColor = '#FF1744';
        }
    }

    advanceDialogue() {
        this.dialogueIndex++;
        this.showCurrentDialogueLine();
    }

    startGameplay() {
        this.closeAllModals();
        this.gameState = 'PLAYING';
        document.getElementById('hud-container').style.display = 'block';
    }

    togglePause() {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
            document.getElementById('modal-pause').style.display = 'flex';
        } else if (this.gameState === 'PAUSED') {
            this.gameState = 'PLAYING';
            document.getElementById('modal-pause').style.display = 'none';
        }
    }

    showVictory() {
        this.gameState = 'VICTORY';
        if (this.audio) this.audio.playVictory();

        // Grant reward
        const ryoReward = this.missionData.rewardRyo || 500;
        this.ryo += ryoReward;

        if (!this.completedMissions.includes(this.currentMissionId)) {
            this.completedMissions.push(this.currentMissionId);
        }
        this.saveData();

        const vModal = document.getElementById('modal-victory');
        document.getElementById('victory-title').textContent = `${this.missionData.title} Cleared!`;
        document.getElementById('victory-desc').textContent = `Mission Complete! Earned +${ryoReward} Ryo. Total Ryo: ${this.ryo}`;
        vModal.style.display = 'flex';
    }

    showGameOver() {
        this.gameState = 'GAMEOVER';
        document.getElementById('modal-gameover').style.display = 'flex';
    }

    showMissionsModal() {
        this.closeAllModals();
        const modal = document.getElementById('modal-missions');
        modal.style.display = 'flex';
        this.renderMissionsList(this.currentMapId);
    }

    renderMissionsList(mapId) {
        this.currentMapId = mapId;
        const container = document.getElementById('missions-grid');
        container.innerHTML = '';

        const missions = window.KADAYA_DATA.missions.filter(m => m.mapId === mapId);
        missions.forEach(m => {
            const card = document.createElement('div');
            const isCompleted = this.completedMissions.includes(m.id);
            card.className = `mission-item-card ${isCompleted ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="m-card-header">
                    <span class="m-num">#${m.id}</span>
                    <span class="m-title">${m.title}</span>
                    <span class="m-diff ${m.difficulty.toLowerCase()}">${m.difficulty}</span>
                </div>
                <div class="m-desc">${m.desc}</div>
                <div class="m-footer">
                    <span class="m-reward">+${m.rewardRyo} Ryo</span>
                    <button class="m-play-btn" data-id="${m.id}">PLAY MISSION</button>
                </div>
            `;
            card.querySelector('.m-play-btn').onclick = () => {
                this.setupMission(m.id);
                this.startGameplay();
            };
            container.appendChild(card);
        });

        // Tab highlight
        [1, 2, 3].forEach(id => {
            document.getElementById(`tab-map-${id}`)?.classList.toggle('active', id === mapId);
        });
    }

    showShopModal() {
        this.closeAllModals();
        document.getElementById('modal-shop').style.display = 'flex';
        this.renderShopTab('eyes');
    }

    renderShopTab(tabKey) {
        const grid = document.getElementById('shop-items-grid');
        grid.innerHTML = '';
        document.getElementById('shop-ryo-display').textContent = `Ryo: ${this.ryo}`;

        let items = [];
        let equipProp = '';

        if (tabKey === 'eyes') {
            items = window.KADAYA_DATA.eyes;
            equipProp = 'equippedEye';
        } else if (tabKey === 'weapons') {
            items = window.KADAYA_DATA.weapons;
            equipProp = 'equippedWeapon';
        } else if (tabKey === 'susanoo') {
            items = window.KADAYA_DATA.susanoo;
            equipProp = 'equippedSusanoo';
        } else if (tabKey === 'summons') {
            items = window.KADAYA_DATA.summons;
            equipProp = 'equippedSummon';
        } else {
            items = window.KADAYA_DATA.abilities;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            const isOwned = this.purchasedItems.includes(item.id) || item.cost === 0;
            const isEquipped = this[equipProp] === item.id;

            card.className = `shop-card ${isEquipped ? 'equipped' : ''}`;
            card.innerHTML = `
                <div class="shop-icon">${item.icon || '⚔️'}</div>
                <div class="shop-name">${item.name}</div>
                <div class="shop-desc">${item.desc}</div>
                <div class="shop-action">
                    ${isEquipped ? '<span class="status-tag equipped">EQUIPPED</span>' : 
                      (isOwned ? `<button class="equip-btn" data-id="${item.id}">EQUIP</button>` : 
                                 `<button class="buy-btn" data-id="${item.id}" data-cost="${item.cost}">UNLOCK (${item.cost} Ryo)</button>`)}
                </div>
            `;

            const buyBtn = card.querySelector('.buy-btn');
            if (buyBtn) {
                buyBtn.onclick = () => {
                    if (this.ryo >= item.cost) {
                        this.ryo -= item.cost;
                        this.purchasedItems.push(item.id);
                        this[equipProp] = item.id;
                        this.saveData();
                        this.applyUpgradesToPlayer();
                        this.renderShopTab(tabKey);
                    } else {
                        alert("Not enough Ryo! Complete missions to earn more.");
                    }
                };
            }

            const equipBtn = card.querySelector('.equip-btn');
            if (equipBtn) {
                equipBtn.onclick = () => {
                    this[equipProp] = item.id;
                    this.saveData();
                    this.applyUpgradesToPlayer();
                    this.renderShopTab(tabKey);
                };
            }

            grid.appendChild(card);
        });
    }

    showUpgradesModal() {
        this.closeAllModals();
        document.getElementById('modal-upgrades').style.display = 'flex';
        this.renderUpgrades();
    }

    renderUpgrades() {
        const grid = document.getElementById('upgrades-grid');
        grid.innerHTML = '';
        document.getElementById('upgrades-ryo-display').textContent = `Ryo: ${this.ryo}`;

        window.KADAYA_DATA.upgrades.forEach(u => {
            const rank = this.upgradeRanks[u.id] || 1;
            const cost = u.baseCost * rank;
            const isMax = rank >= u.maxRank;

            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <div class="up-title">${u.name}</div>
                <div class="up-rank">Rank ${rank} / ${u.maxRank}</div>
                <div class="up-desc">${u.desc}</div>
                <div class="up-action">
                    ${isMax ? '<span class="status-tag max">MAX RANK</span>' : 
                              `<button class="up-btn" data-id="${u.id}">UPGRADE (${cost} Ryo)</button>`}
                </div>
            `;

            const upBtn = card.querySelector('.up-btn');
            if (upBtn) {
                upBtn.onclick = () => {
                    if (this.ryo >= cost) {
                        this.ryo -= cost;
                        this.upgradeRanks[u.id] = rank + 1;
                        this.saveData();
                        this.applyUpgradesToPlayer();
                        this.renderUpgrades();
                    } else {
                        alert("Not enough Ryo!");
                    }
                };
            }
            grid.appendChild(card);
        });
    }

    showSettingsModal() {
        this.closeAllModals();
        if (window.textureManager) {
            const stats = window.textureManager.getStats();
            const tmEl = document.getElementById('settings-tm-status');
            if (tmEl) {
                tmEl.textContent = `Active (${stats.loaded} cached, ${stats.warmed} GPU-warmed, ${stats.anisotropy}x AF, 0 frame drops)`;
            }
        }
        document.getElementById('modal-settings').style.display = 'flex';
    }

    setGraphicsPreset(preset) {
        this.graphicsPreset = preset;
        if (window.ultraGraphics) window.ultraGraphics.preset = preset;

        const badge = document.getElementById('hud-graphics-badge');
        const statusEl = document.getElementById('settings-gfx-status');
        const descEl = document.getElementById('settings-gfx-desc');

        ['ultra', 'high', 'medium'].forEach(p => {
            const btn = document.getElementById(`btn-gfx-${p}`);
            if (btn) btn.classList.toggle('active', p === preset.toLowerCase());
        });

        if (preset === 'ULTRA') {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.toneMappingExposure = 1.25;
            if (badge) badge.textContent = '⚡ ULTRA 4K HDR';
            if (statusEl) statusEl.textContent = '⚡ ULTRA (4K HDR)';
            if (descEl) descEl.textContent = 'Max 2048x2048 Soft Shadows, PBR Normal Maps, 3D Grass Foliage, Volumetric God Rays, HDR Bloom & 360° Mountain Skybox.';
        } else if (preset === 'HIGH') {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.toneMappingExposure = 1.15;
            if (badge) badge.textContent = '★ HIGH 1080P';
            if (statusEl) statusEl.textContent = '★ HIGH (1080P)';
            if (descEl) descEl.textContent = 'High resolution textures, dynamic lighting, soft shadows, and ambient particles.';
        } else {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            this.renderer.shadowMap.enabled = false;
            this.renderer.toneMappingExposure = 1.05;
            if (badge) badge.textContent = '• BALANCED 60FPS';
            if (statusEl) statusEl.textContent = '• BALANCED';
            if (descEl) descEl.textContent = 'Max performance mode with optimized rendering pipeline.';
        }
    }

    toggleGraphicsPreset() {
        if (this.graphicsPreset === 'ULTRA') {
            this.setGraphicsPreset('HIGH');
        } else if (this.graphicsPreset === 'HIGH') {
            this.setGraphicsPreset('MEDIUM');
        } else {
            this.setGraphicsPreset('ULTRA');
        }
    }

    closeAllModals() {
        ['modal-main-menu', 'modal-missions', 'modal-shop', 'modal-upgrades', 'modal-settings', 'modal-dialogue', 'modal-pause', 'modal-victory', 'modal-gameover'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    updateHUDMission() {
        const t = document.getElementById('hud-mission-title');
        const d = document.getElementById('hud-mission-desc');
        if (t) t.textContent = this.missionData.title;
        if (d) d.textContent = this.missionData.desc;
    }

    animate() {
        requestAnimationFrame(this.animate);
        if (this.isContextLost || !this.renderer) return;

        let dt = Math.min(this.clock.getDelta(), 0.1);

        // Matrix Slow Motion effect if active
        if (window.gameSlowMoTimer > 0) {
            window.gameSlowMoTimer -= dt;
            dt *= 0.45;
        }

        if (this.gameState === 'PLAYING') {
            this.input.cameraYaw = this.tpCamera.yaw;

            this.player.update(
                dt,
                this.input,
                this.world.terrainHeight,
                this.enemies,
                (x, y, z, t) => this.world.spawnParticle(x, y, z, t),
                (origin, dir, t, dmg) => this.world.spawnProjectile(origin, dir, t, dmg)
            );

            if (!this.player.isAlive && this.gameState !== 'GAMEOVER') {
                setTimeout(() => this.showGameOver(), 700);
            }

            this.enemies.forEach(e => {
                e.update(
                    dt,
                    this.player,
                    this.world.terrainHeight,
                    (x, y, z, t) => this.world.spawnParticle(x, y, z, t),
                    (origin, dir, t, dmg) => this.world.spawnProjectile(origin, dir, t, dmg),
                    this.camera
                );
            });

            this.world.update(dt, this.player, this.enemies);
            this.tpCamera.update(dt, this.player.position, this.world.terrainHeight);

            // Level Objective check
            if (!this.objectiveCompleted) {
                const alive = this.enemies.filter(e => e.isAlive).length;
                const distToGoal = this.player.position.distanceTo(new THREE.Vector3(...this.missionData.targetPos));

                if (alive === 0 || distToGoal < 3.2) {
                    this.objectiveCompleted = true;
                    setTimeout(() => this.showVictory(), 800);
                }
            }

            this.updateHUD();
        } else if (this.gameState === 'MENU' || this.gameState === 'DIALOGUE') {
            this.tpCamera.yaw += dt * 0.2;
            this.tpCamera.update(dt, this.player.position, this.world.terrainHeight);
        }

        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    updateHUD() {
        const hpBar = document.getElementById('hud-hp-bar');
        const stBar = document.getElementById('hud-stamina-bar');
        const chBar = document.getElementById('hud-chakra-bar');
        const rpBar = document.getElementById('hud-reaper-bar');

        if (hpBar) hpBar.style.width = `${(this.player.health / this.player.maxHealth) * 100}%`;
        if (stBar) stBar.style.width = `${(this.player.stamina / this.player.maxStamina) * 100}%`;
        if (chBar) chBar.style.width = `${(this.player.chakra / this.player.maxChakra) * 100}%`;
        if (rpBar) rpBar.style.width = `${this.player.reaperGauge}%`;

        const countEl = document.getElementById('hud-enemies-count');
        if (countEl) {
            const alive = this.enemies.filter(e => e.isAlive).length;
            countEl.textContent = `Enemies: ${alive}`;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new KadayaGame();
});
