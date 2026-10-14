// Game Data & Catalog Definitions for KADAYA: THE LAST SHADOW
// Complete definition of 3 Maps, 45 Missions, 7 Eyes, 6 Weapons, 2 Susanoo, 29 Summons, Upgrades, and Lore

window.KADAYA_DATA = {
    // 3 Maps with 15 Missions each = 45 Playable Levels
    maps: [
        {
            id: 1,
            name: "Blood Moon Forest",
            subtitle: "Dense supernatural woods bathed in crimson moonlight",
            theme: "forest",
            skyColor: 0x120814,
            fogColor: 0x140E1C,
            lightColor: 0xE57373,
            ambientColor: 0x221326
        },
        {
            id: 2,
            name: "Haunted Graveyard",
            subtitle: "Ancient tombs and restless souls on the border of the Shadow Realm",
            theme: "graveyard",
            skyColor: 0x081018,
            fogColor: 0x0A1620,
            lightColor: 0x80DEEA,
            ambientColor: 0x10202A
        },
        {
            id: 3,
            name: "Burning Temple",
            subtitle: "Ancient sanctuary consumed by supernatural volcanic flames",
            theme: "temple",
            skyColor: 0x1C0A0A,
            fogColor: 0x261010,
            lightColor: 0xFF7043,
            ambientColor: 0x2E1410
        }
    ],

    // 45 Distinct Missions
    missions: [
        // MAP 1: Blood Moon Forest (15 Missions)
        {
            id: 1,
            mapId: 1,
            levelNum: 1,
            title: "The Awakening",
            desc: "Learn basic movement and combat while surviving the first shadow attack in the burning outskirts.",
            difficulty: "Novice",
            playerSpawn: [0, 0, 18],
            targetPos: [0, 0, -30],
            targetName: "Ancient Torii",
            rewardRyo: 250,
            enemies: [
                { type: 'scout', pos: [0, 0, 6], wp: [[-3, 0, 6], [3, 0, 6]] },
                { type: 'scout', pos: [-6, 0, -8], wp: [[-6, 0, -12], [-6, 0, -4]] },
                { type: 'scout', pos: [6, 0, -10], wp: [[6, 0, -6], [6, 0, -14]] }
            ]
        },
        {
            id: 2,
            mapId: 1,
            levelNum: 2,
            title: "Silent Footsteps",
            desc: "Defeat patrols using swift evasive tactics and stealth through the misty grove.",
            difficulty: "Novice",
            playerSpawn: [0, 0, 20],
            targetPos: [0, 0, -32],
            targetName: "Grove Exit",
            rewardRyo: 300,
            enemies: [
                { type: 'scout', pos: [-5, 0, 8], wp: [[-8, 0, 8], [-2, 0, 8]] },
                { type: 'scout', pos: [5, 0, 0], wp: [[2, 0, 0], [8, 0, 0]] },
                { type: 'scout', pos: [0, 0, -14], wp: [[-4, 0, -14], [4, 0, -14]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-3, 0, -22], [3, 0, -22]] }
            ]
        },
        {
            id: 3,
            mapId: 1,
            levelNum: 3,
            title: "Broken Shrine",
            desc: "Reach and investigate the ruined lotus shrine to recover ancient chakra fragments.",
            difficulty: "Easy",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -34],
            targetName: "Lotus Shrine",
            rewardRyo: 350,
            enemies: [
                { type: 'scout', pos: [-6, 0, 10], wp: [[-6, 0, 6], [-6, 0, 14]] },
                { type: 'scout', pos: [6, 0, 8], wp: [[6, 0, 4], [6, 0, 12]] },
                { type: 'spellcaster', pos: [0, 0, -6], wp: [[-4, 0, -6], [4, 0, -6]] },
                { type: 'samurai', pos: [0, 0, -24], wp: [[-3, 0, -24], [3, 0, -24]] }
            ]
        },
        {
            id: 4,
            mapId: 1,
            levelNum: 4,
            title: "The Lost Path",
            desc: "Navigate branching forest paths while neutralizing shadow ambushes.",
            difficulty: "Easy",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -35],
            targetName: "Deep Woods",
            rewardRyo: 400,
            enemies: [
                { type: 'scout', pos: [-7, 0, 12], wp: [[-7, 0, 8], [-7, 0, 16]] },
                { type: 'scout', pos: [7, 0, 12], wp: [[7, 0, 8], [7, 0, 16]] },
                { type: 'samurai', pos: [-4, 0, -4], wp: [[-4, 0, -8], [-4, 0, 0]] },
                { type: 'samurai', pos: [4, 0, -4], wp: [[4, 0, -8], [4, 0, 0]] },
                { type: 'spellcaster', pos: [0, 0, -20], wp: [[-4, 0, -20], [4, 0, -20]] }
            ]
        },
        {
            id: 5,
            mapId: 1,
            levelNum: 5,
            title: "Hunters in the Mist",
            desc: "Survive coordinated waves of agile shadow assassins cloaked by supernatural fog.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 20],
            targetPos: [0, 0, -32],
            targetName: "Clear Horizon",
            rewardRyo: 450,
            enemies: [
                { type: 'scout', pos: [-5, 0, 8], wp: [[-8, 0, 8], [-2, 0, 8]] },
                { type: 'scout', pos: [5, 0, 8], wp: [[2, 0, 8], [8, 0, 8]] },
                { type: 'scout', pos: [-6, 0, -8], wp: [[-6, 0, -12], [-6, 0, -4]] },
                { type: 'scout', pos: [6, 0, -8], wp: [[6, 0, -4], [6, 0, -12]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 6,
            mapId: 1,
            levelNum: 6,
            title: "Cursed Bridge",
            desc: "Cross a hazardous stone bridge guarded by armored samurai archers.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Far Shore",
            rewardRyo: 500,
            enemies: [
                { type: 'samurai', pos: [0, 0, 10], wp: [[-2, 0, 10], [2, 0, 10]] },
                { type: 'spellcaster', pos: [-5, 0, -2], wp: [[-5, 0, -6], [-5, 0, 2]] },
                { type: 'spellcaster', pos: [5, 0, -2], wp: [[5, 0, -6], [5, 0, 2]] },
                { type: 'samurai', pos: [0, 0, -18], wp: [[-3, 0, -18], [3, 0, -18]] }
            ]
        },
        {
            id: 7,
            mapId: 1,
            levelNum: 7,
            title: "Shadow Totems",
            desc: "Locate and destroy supernatural enemy power sources corrupting the soil.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -32],
            targetName: "Central Totem",
            rewardRyo: 550,
            enemies: [
                { type: 'scout', pos: [-6, 0, 6], wp: [[-6, 0, 2], [-6, 0, 10]] },
                { type: 'scout', pos: [6, 0, 6], wp: [[6, 0, 2], [6, 0, 10]] },
                { type: 'samurai', pos: [0, 0, -6], wp: [[-4, 0, -6], [4, 0, -6]] },
                { type: 'spellcaster', pos: [-5, 0, -20], wp: [[-5, 0, -24], [-5, 0, -16]] },
                { type: 'spellcaster', pos: [5, 0, -20], wp: [[5, 0, -24], [5, 0, -16]] }
            ]
        },
        {
            id: 8,
            mapId: 1,
            levelNum: 8,
            title: "The Hidden Camp",
            desc: "Infiltrate an enemy vanguard encampment and eliminate their commander.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -34],
            targetName: "Command Post",
            rewardRyo: 600,
            enemies: [
                { type: 'scout', pos: [-5, 0, 10], wp: [[-8, 0, 10], [-2, 0, 10]] },
                { type: 'scout', pos: [5, 0, 10], wp: [[2, 0, 10], [8, 0, 10]] },
                { type: 'samurai', pos: [-4, 0, -4], wp: [[-4, 0, -8], [-4, 0, 0]] },
                { type: 'samurai', pos: [4, 0, -4], wp: [[4, 0, -8], [4, 0, 0]] },
                { type: 'miniboss', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 9,
            mapId: 1,
            levelNum: 9,
            title: "Blood Moon Ritual",
            desc: "Interrupt a dark summoning ritual before shadow reinforcements break through.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -32],
            targetName: "Ritual Circle",
            rewardRyo: 650,
            enemies: [
                { type: 'spellcaster', pos: [-4, 0, 8], wp: [[-4, 0, 4], [-4, 0, 12]] },
                { type: 'spellcaster', pos: [4, 0, 8], wp: [[4, 0, 4], [4, 0, 12]] },
                { type: 'samurai', pos: [0, 0, -4], wp: [[-4, 0, -4], [4, 0, -4]] },
                { type: 'scout', pos: [-6, 0, -16], wp: [[-6, 0, -20], [-6, 0, -12]] },
                { type: 'scout', pos: [6, 0, -16], wp: [[6, 0, -20], [6, 0, -12]] }
            ]
        },
        {
            id: 10,
            mapId: 1,
            levelNum: 10,
            title: "The Forest Guardian",
            desc: "Confront the corrupted Guardian Kurokaze guarding the deeper forest threshold.",
            difficulty: "Boss",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -20],
            targetName: "Guardian Arena",
            rewardRyo: 800,
            enemies: [
                { type: 'miniboss', pos: [0, 0, -18], wp: [[-6, 0, -18], [6, 0, -18]] },
                { type: 'scout', pos: [-6, 0, -4], wp: [[-6, 0, -8], [-6, 0, 0]] },
                { type: 'scout', pos: [6, 0, -4], wp: [[6, 0, -8], [6, 0, 0]] }
            ]
        },
        {
            id: 11,
            mapId: 1,
            levelNum: 11,
            title: "Broken Alliances",
            desc: "Survive coordinated crossfire between spellcasters and heavy armored samurai.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -35],
            targetName: "Allied Bastion",
            rewardRyo: 750,
            enemies: [
                { type: 'samurai', pos: [-4, 0, 8], wp: [[-7, 0, 8], [-1, 0, 8]] },
                { type: 'samurai', pos: [4, 0, 8], wp: [[1, 0, 8], [7, 0, 8]] },
                { type: 'spellcaster', pos: [-6, 0, -8], wp: [[-6, 0, -12], [-6, 0, -4]] },
                { type: 'spellcaster', pos: [6, 0, -8], wp: [[6, 0, -4], [6, 0, -12]] },
                { type: 'samurai', pos: [0, 0, -24], wp: [[-4, 0, -24], [4, 0, -24]] }
            ]
        },
        {
            id: 12,
            mapId: 1,
            levelNum: 12,
            title: "The Spirit Trail",
            desc: "Follow spectral spirit wisps through an enchanted thicket to uncover Raizen's trail.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -36],
            targetName: "Spirit Well",
            rewardRyo: 800,
            enemies: [
                { type: 'scout', pos: [0, 0, 8], wp: [[-4, 0, 8], [4, 0, 8]] },
                { type: 'scout', pos: [-5, 0, -4], wp: [[-5, 0, -8], [-5, 0, 0]] },
                { type: 'scout', pos: [5, 0, -4], wp: [[5, 0, -8], [5, 0, 0]] },
                { type: 'spellcaster', pos: [0, 0, -16], wp: [[-5, 0, -16], [5, 0, -16]] },
                { type: 'samurai', pos: [0, 0, -26], wp: [[-3, 0, -26], [3, 0, -26]] }
            ]
        },
        {
            id: 13,
            mapId: 1,
            levelNum: 13,
            title: "The Crimson Hunt",
            desc: "Track down an elite shadow stalker moving with blinding phantom speed.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -32],
            targetName: "Hunter's Glade",
            rewardRyo: 900,
            enemies: [
                { type: 'scout', pos: [-6, 0, 10], wp: [[-6, 0, 6], [-6, 0, 14]] },
                { type: 'scout', pos: [6, 0, 10], wp: [[6, 0, 6], [6, 0, 14]] },
                { type: 'miniboss', pos: [0, 0, -12], wp: [[-5, 0, -12], [5, 0, -12]] },
                { type: 'samurai', pos: [0, 0, -24], wp: [[-4, 0, -24], [4, 0, -24]] }
            ]
        },
        {
            id: 14,
            mapId: 1,
            levelNum: 14,
            title: "Gate of Shadows",
            desc: "Destroy the magical wards holding the portal between the forest and graveyard.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Shadow Gate",
            rewardRyo: 1000,
            enemies: [
                { type: 'samurai', pos: [-5, 0, 8], wp: [[-5, 0, 4], [-5, 0, 12]] },
                { type: 'samurai', pos: [5, 0, 8], wp: [[5, 0, 4], [5, 0, 12]] },
                { type: 'spellcaster', pos: [0, 0, -2], wp: [[-4, 0, -2], [4, 0, -2]] },
                { type: 'spellcaster', pos: [-4, 0, -18], wp: [[-4, 0, -22], [-4, 0, -14]] },
                { type: 'samurai', pos: [4, 0, -18], wp: [[4, 0, -22], [4, 0, -14]] }
            ]
        },
        {
            id: 15,
            mapId: 1,
            levelNum: 15,
            title: "The First Reckoning",
            desc: "Face the Chapter 1 Warlord and break the Blood Moon curse over the forest!",
            difficulty: "Chapter Boss",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -20],
            targetName: "Forest Throne",
            rewardRyo: 1500,
            enemies: [
                { type: 'miniboss', pos: [0, 0, -18], wp: [[-7, 0, -18], [7, 0, -18]] },
                { type: 'samurai', pos: [-5, 0, -6], wp: [[-5, 0, -10], [-5, 0, -2]] },
                { type: 'spellcaster', pos: [5, 0, -6], wp: [[5, 0, -10], [5, 0, -2]] }
            ]
        },

        // MAP 2: Haunted Graveyard (15 Missions)
        {
            id: 16,
            mapId: 2,
            levelNum: 1,
            title: "Beyond the Grave",
            desc: "Enter the misty cemetery gates and survive the first undead legion ambush.",
            difficulty: "Novice",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -30],
            targetName: "Cemetery Path",
            rewardRyo: 300,
            enemies: [
                { type: 'scout', pos: [0, 0, 6], wp: [[-3, 0, 6], [3, 0, 6]] },
                { type: 'scout', pos: [-6, 0, -8], wp: [[-6, 0, -12], [-6, 0, -4]] },
                { type: 'samurai', pos: [0, 0, -20], wp: [[-3, 0, -20], [3, 0, -20]] }
            ]
        },
        {
            id: 17,
            mapId: 2,
            levelNum: 2,
            title: "Restless Souls",
            desc: "Purge the wandering phantom warriors haunting the memorial row.",
            difficulty: "Easy",
            playerSpawn: [0, 0, 20],
            targetPos: [0, 0, -32],
            targetName: "Memorial Arch",
            rewardRyo: 350,
            enemies: [
                { type: 'scout', pos: [-5, 0, 6], wp: [[-8, 0, 6], [-2, 0, 6]] },
                { type: 'scout', pos: [5, 0, 6], wp: [[2, 0, 6], [8, 0, 6]] },
                { type: 'spellcaster', pos: [0, 0, -8], wp: [[-4, 0, -8], [4, 0, -8]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 18,
            mapId: 2,
            levelNum: 3,
            title: "Tomb Raider",
            desc: "Explore ancient stone tombs to recover the Soul Key fragment.",
            difficulty: "Easy",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -34],
            targetName: "Tomb Vault",
            rewardRyo: 400,
            enemies: [
                { type: 'samurai', pos: [-4, 0, 8], wp: [[-4, 0, 4], [-4, 0, 12]] },
                { type: 'samurai', pos: [4, 0, 8], wp: [[4, 0, 4], [4, 0, 12]] },
                { type: 'spellcaster', pos: [0, 0, -10], wp: [[-4, 0, -10], [4, 0, -10]] }
            ]
        },
        {
            id: 19,
            mapId: 2,
            levelNum: 4,
            title: "The Bone Gate",
            desc: "Defeat cursed skeletal guardians protecting the sealed cemetery wall.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -35],
            targetName: "Bone Gate",
            rewardRyo: 450,
            enemies: [
                { type: 'scout', pos: [-6, 0, 10], wp: [[-6, 0, 6], [-6, 0, 14]] },
                { type: 'scout', pos: [6, 0, 10], wp: [[6, 0, 6], [6, 0, 14]] },
                { type: 'samurai', pos: [0, 0, -4], wp: [[-4, 0, -4], [4, 0, -4]] },
                { type: 'samurai', pos: [0, 0, -20], wp: [[-4, 0, -20], [4, 0, -20]] }
            ]
        },
        {
            id: 20,
            mapId: 2,
            levelNum: 5,
            title: "Graveyard Watchers",
            desc: "Eliminate patrol sentries before they signal the undead army.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -34],
            targetName: "Watch Tower",
            rewardRyo: 500,
            enemies: [
                { type: 'scout', pos: [-5, 0, 8], wp: [[-8, 0, 8], [-2, 0, 8]] },
                { type: 'scout', pos: [5, 0, 8], wp: [[2, 0, 8], [8, 0, 8]] },
                { type: 'spellcaster', pos: [-5, 0, -10], wp: [[-5, 0, -14], [-5, 0, -6]] },
                { type: 'spellcaster', pos: [5, 0, -10], wp: [[5, 0, -6], [5, 0, -14]] }
            ]
        },
        {
            id: 21,
            mapId: 2,
            levelNum: 6,
            title: "Cursed Mausoleum",
            desc: "Fight through an indoor mausoleum corridor thick with dark sorcery.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 20],
            targetPos: [0, 0, -32],
            targetName: "Mausoleum Altar",
            rewardRyo: 550,
            enemies: [
                { type: 'samurai', pos: [0, 0, 8], wp: [[-3, 0, 8], [3, 0, 8]] },
                { type: 'scout', pos: [-5, 0, -4], wp: [[-5, 0, -8], [-5, 0, 0]] },
                { type: 'scout', pos: [5, 0, -4], wp: [[5, 0, -8], [5, 0, 0]] },
                { type: 'samurai', pos: [0, 0, -20], wp: [[-3, 0, -20], [3, 0, -20]] }
            ]
        },
        {
            id: 22,
            mapId: 2,
            levelNum: 7,
            title: "The Forgotten Warrior",
            desc: "Duel an ancient champion risen from a centuries-old grave.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -26],
            targetName: "Champion's Tomb",
            rewardRyo: 650,
            enemies: [
                { type: 'miniboss', pos: [0, 0, -18], wp: [[-5, 0, -18], [5, 0, -18]] },
                { type: 'scout', pos: [-5, 0, 0], wp: [[-5, 0, -4], [-5, 0, 4]] },
                { type: 'scout', pos: [5, 0, 0], wp: [[5, 0, -4], [5, 0, 4]] }
            ]
        },
        {
            id: 23,
            mapId: 2,
            levelNum: 8,
            title: "Shattered Seals",
            desc: "Locate and dispel the three necro-seals anchoring spirits to this realm.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Primary Seal",
            rewardRyo: 700,
            enemies: [
                { type: 'spellcaster', pos: [-4, 0, 6], wp: [[-4, 0, 2], [-4, 0, 10]] },
                { type: 'spellcaster', pos: [4, 0, 6], wp: [[4, 0, 2], [4, 0, 10]] },
                { type: 'samurai', pos: [0, 0, -8], wp: [[-4, 0, -8], [4, 0, -8]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 24,
            mapId: 2,
            levelNum: 9,
            title: "Whispers Below",
            desc: "Descend into the underground catacomb passages under heavy enemy pressure.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -34],
            targetName: "Catacomb Depths",
            rewardRyo: 750,
            enemies: [
                { type: 'scout', pos: [-6, 0, 8], wp: [[-6, 0, 4], [-6, 0, 12]] },
                { type: 'scout', pos: [6, 0, 8], wp: [[6, 0, 4], [6, 0, 12]] },
                { type: 'samurai', pos: [-3, 0, -6], wp: [[-3, 0, -10], [-3, 0, -2]] },
                { type: 'samurai', pos: [3, 0, -6], wp: [[3, 0, -10], [3, 0, -2]] },
                { type: 'spellcaster', pos: [0, 0, -20], wp: [[-4, 0, -20], [4, 0, -20]] }
            ]
        },
        {
            id: 25,
            mapId: 2,
            levelNum: 10,
            title: "The Soul Collector",
            desc: "Neutralize a dark summoner conjuring waves of shadow phantoms.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -30],
            targetName: "Collector's Pyre",
            rewardRyo: 800,
            enemies: [
                { type: 'spellcaster', pos: [0, 0, -12], wp: [[-5, 0, -12], [5, 0, -12]] },
                { type: 'scout', pos: [-5, 0, 4], wp: [[-5, 0, 0], [-5, 0, 8]] },
                { type: 'scout', pos: [5, 0, 4], wp: [[5, 0, 0], [5, 0, 8]] },
                { type: 'samurai', pos: [0, 0, -24], wp: [[-4, 0, -24], [4, 0, -24]] }
            ]
        },
        {
            id: 26,
            mapId: 2,
            levelNum: 11,
            title: "Night of the Dead",
            desc: "Survive a relentless multi-wave assault under the eclipse sky.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -32],
            targetName: "Sanctified Circle",
            rewardRyo: 900,
            enemies: [
                { type: 'scout', pos: [-6, 0, 8], wp: [[-6, 0, 4], [-6, 0, 12]] },
                { type: 'scout', pos: [6, 0, 8], wp: [[6, 0, 4], [6, 0, 12]] },
                { type: 'samurai', pos: [-4, 0, -6], wp: [[-4, 0, -10], [-4, 0, -2]] },
                { type: 'samurai', pos: [4, 0, -6], wp: [[4, 0, -10], [4, 0, -2]] },
                { type: 'spellcaster', pos: [0, 0, -22], wp: [[-5, 0, -22], [5, 0, -22]] }
            ]
        },
        {
            id: 27,
            mapId: 2,
            levelNum: 12,
            title: "The Lost Relic",
            desc: "Retrieve the ancient Obsidian Scythe Blade from the royal tomb.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Royal Crypt",
            rewardRyo: 950,
            enemies: [
                { type: 'samurai', pos: [-4, 0, 8], wp: [[-7, 0, 8], [-1, 0, 8]] },
                { type: 'samurai', pos: [4, 0, 8], wp: [[1, 0, 8], [7, 0, 8]] },
                { type: 'spellcaster', pos: [0, 0, -6], wp: [[-4, 0, -6], [4, 0, -6]] },
                { type: 'miniboss', pos: [0, 0, -22], wp: [[-5, 0, -22], [5, 0, -22]] }
            ]
        },
        {
            id: 28,
            mapId: 2,
            levelNum: 13,
            title: "Crypt of Echoes",
            desc: "Navigate narrow subterranean halls while dodging lethal spike traps and guardians.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -34],
            targetName: "Echo Chamber",
            rewardRyo: 1000,
            enemies: [
                { type: 'scout', pos: [-5, 0, 10], wp: [[-5, 0, 6], [-5, 0, 14]] },
                { type: 'scout', pos: [5, 0, 10], wp: [[5, 0, 6], [5, 0, 14]] },
                { type: 'spellcaster', pos: [-4, 0, -8], wp: [[-4, 0, -12], [-4, 0, -4]] },
                { type: 'spellcaster', pos: [4, 0, -8], wp: [[4, 0, -4], [4, 0, -12]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-3, 0, -22], [3, 0, -22]] }
            ]
        },
        {
            id: 29,
            mapId: 2,
            levelNum: 14,
            title: "The Gravekeeper",
            desc: "Defeat the multi-phase undead titan overseeing the cemetery necropolis.",
            difficulty: "Mini-Boss",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -22],
            targetName: "Gravekeeper Arena",
            rewardRyo: 1200,
            enemies: [
                { type: 'miniboss', pos: [0, 0, -18], wp: [[-6, 0, -18], [6, 0, -18]] },
                { type: 'samurai', pos: [-5, 0, -4], wp: [[-5, 0, -8], [-5, 0, 0]] },
                { type: 'spellcaster', pos: [5, 0, -4], wp: [[5, 0, -8], [5, 0, 0]] }
            ]
        },
        {
            id: 30,
            mapId: 2,
            levelNum: 15,
            title: "The Cursed Sovereign",
            desc: "Slay the Chapter 2 Final Sovereign and unlock the gateway to the Burning Temple!",
            difficulty: "Chapter Boss",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -20],
            targetName: "Sovereign Tomb",
            rewardRyo: 1800,
            enemies: [
                { type: 'miniboss', pos: [0, 0, -16], wp: [[-7, 0, -16], [7, 0, -16]] },
                { type: 'samurai', pos: [-4, 0, -4], wp: [[-4, 0, -8], [-4, 0, 0]] },
                { type: 'samurai', pos: [4, 0, -4], wp: [[4, 0, -8], [4, 0, 0]] }
            ]
        },

        // MAP 3: Burning Temple (15 Missions)
        {
            id: 31,
            mapId: 3,
            levelNum: 1,
            title: "Ashes of the Past",
            desc: "Enter the blazing outer temple courtyard and breach the burning barricades.",
            difficulty: "Novice",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -30],
            targetName: "Temple Gate",
            rewardRyo: 400,
            enemies: [
                { type: 'scout', pos: [0, 0, 6], wp: [[-3, 0, 6], [3, 0, 6]] },
                { type: 'samurai', pos: [-5, 0, -8], wp: [[-5, 0, -12], [-5, 0, -4]] },
                { type: 'samurai', pos: [5, 0, -8], wp: [[5, 0, -4], [5, 0, -12]] }
            ]
        },
        {
            id: 32,
            mapId: 3,
            levelNum: 2,
            title: "Flamebound Path",
            desc: "Navigate perilous stone corridors surrounded by falling magma and embers.",
            difficulty: "Easy",
            playerSpawn: [0, 0, 20],
            targetPos: [0, 0, -32],
            targetName: "Upper Corridor",
            rewardRyo: 450,
            enemies: [
                { type: 'scout', pos: [-5, 0, 8], wp: [[-8, 0, 8], [-2, 0, 8]] },
                { type: 'scout', pos: [5, 0, 8], wp: [[2, 0, 8], [8, 0, 8]] },
                { type: 'spellcaster', pos: [0, 0, -8], wp: [[-4, 0, -8], [4, 0, -8]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 33,
            mapId: 3,
            levelNum: 3,
            title: "The Broken Courtyard",
            desc: "Clear a scorched ceremonial courtyard fortified by elite fire monks.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -34],
            targetName: "Inner Portal",
            rewardRyo: 500,
            enemies: [
                { type: 'samurai', pos: [-4, 0, 6], wp: [[-4, 0, 2], [-4, 0, 10]] },
                { type: 'samurai', pos: [4, 0, 6], wp: [[4, 0, 2], [4, 0, 10]] },
                { type: 'spellcaster', pos: [0, 0, -6], wp: [[-4, 0, -6], [4, 0, -6]] },
                { type: 'scout', pos: [0, 0, -20], wp: [[-5, 0, -20], [5, 0, -20]] }
            ]
        },
        {
            id: 34,
            mapId: 3,
            levelNum: 4,
            title: "Temple of Echoes",
            desc: "Uncover ancient inscribed scrolls revealing Raizen's corrupted heritage.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -35],
            targetName: "Scroll Chamber",
            rewardRyo: 550,
            enemies: [
                { type: 'scout', pos: [-6, 0, 8], wp: [[-6, 0, 4], [-6, 0, 12]] },
                { type: 'scout', pos: [6, 0, 8], wp: [[6, 0, 4], [6, 0, 12]] },
                { type: 'samurai', pos: [-3, 0, -8], wp: [[-3, 0, -12], [-3, 0, -4]] },
                { type: 'samurai', pos: [3, 0, -8], wp: [[3, 0, -4], [3, 0, -12]] }
            ]
        },
        {
            id: 35,
            mapId: 3,
            levelNum: 5,
            title: "Blazing Arrows",
            desc: "Dash through raining incendiary arrows from watchtowers across the courtyard.",
            difficulty: "Medium",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Tower Base",
            rewardRyo: 600,
            enemies: [
                { type: 'spellcaster', pos: [-5, 0, 8], wp: [[-5, 0, 4], [-5, 0, 12]] },
                { type: 'spellcaster', pos: [5, 0, 8], wp: [[5, 0, 4], [5, 0, 12]] },
                { type: 'samurai', pos: [0, 0, -4], wp: [[-4, 0, -4], [4, 0, -4]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 36,
            mapId: 3,
            levelNum: 6,
            title: "The Fallen Monk",
            desc: "Subdue an ancient high monk turned mad by the Shadow Realm fire.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -28],
            targetName: "Monk Sanctuary",
            rewardRyo: 700,
            enemies: [
                { type: 'miniboss', pos: [0, 0, -18], wp: [[-5, 0, -18], [5, 0, -18]] },
                { type: 'scout', pos: [-5, 0, 0], wp: [[-5, 0, -4], [-5, 0, 4]] },
                { type: 'scout', pos: [5, 0, 0], wp: [[5, 0, -4], [5, 0, 4]] }
            ]
        },
        {
            id: 37,
            mapId: 3,
            levelNum: 7,
            title: "Infernal Forge",
            desc: "Destroy the demonic forge creating dark armor for Raizen's commanders.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -34],
            targetName: "Molten Core",
            rewardRyo: 750,
            enemies: [
                { type: 'samurai', pos: [-4, 0, 8], wp: [[-7, 0, 8], [-1, 0, 8]] },
                { type: 'samurai', pos: [4, 0, 8], wp: [[1, 0, 8], [7, 0, 8]] },
                { type: 'spellcaster', pos: [0, 0, -6], wp: [[-4, 0, -6], [4, 0, -6]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 38,
            mapId: 3,
            levelNum: 8,
            title: "The Fire Trial",
            desc: "Survive a grueling gauntlet in a shrinking arena of volcanic fissures.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -32],
            targetName: "Trial Dais",
            rewardRyo: 850,
            enemies: [
                { type: 'scout', pos: [-6, 0, 8], wp: [[-6, 0, 4], [-6, 0, 12]] },
                { type: 'scout', pos: [6, 0, 8], wp: [[6, 0, 4], [6, 0, 12]] },
                { type: 'spellcaster', pos: [-4, 0, -6], wp: [[-4, 0, -10], [-4, 0, -2]] },
                { type: 'spellcaster', pos: [4, 0, -6], wp: [[4, 0, -2], [4, 0, -10]] },
                { type: 'samurai', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 39,
            mapId: 3,
            levelNum: 9,
            title: "Shattered Roofs",
            desc: "Platform across blazing temple tile rooftops while defeating flying spellcasters.",
            difficulty: "Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Apex Roof",
            rewardRyo: 900,
            enemies: [
                { type: 'scout', pos: [-5, 0, 8], wp: [[-5, 0, 4], [-5, 0, 12]] },
                { type: 'scout', pos: [5, 0, 8], wp: [[5, 0, 4], [5, 0, 12]] },
                { type: 'spellcaster', pos: [0, 0, -4], wp: [[-4, 0, -4], [4, 0, -4]] },
                { type: 'samurai', pos: [0, 0, -20], wp: [[-3, 0, -20], [3, 0, -20]] }
            ]
        },
        {
            id: 40,
            mapId: 3,
            levelNum: 10,
            title: "The Burning Archive",
            desc: "Safeguard the last sacred Lotus codex before the demonic fire consumes it.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -32],
            targetName: "Lotus Archive",
            rewardRyo: 1000,
            enemies: [
                { type: 'samurai', pos: [-4, 0, 6], wp: [[-4, 0, 2], [-4, 0, 10]] },
                { type: 'samurai', pos: [4, 0, 6], wp: [[4, 0, 2], [4, 0, 10]] },
                { type: 'spellcaster', pos: [0, 0, -8], wp: [[-5, 0, -8], [5, 0, -8]] },
                { type: 'miniboss', pos: [0, 0, -22], wp: [[-4, 0, -22], [4, 0, -22]] }
            ]
        },
        {
            id: 41,
            mapId: 3,
            levelNum: 11,
            title: "The Demon Gate",
            desc: "Dispel the demonic warding barriers sealing the inner sanctuary doors.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Demon Barrier",
            rewardRyo: 1100,
            enemies: [
                { type: 'spellcaster', pos: [-5, 0, 8], wp: [[-5, 0, 4], [-5, 0, 12]] },
                { type: 'spellcaster', pos: [5, 0, 8], wp: [[5, 0, 4], [5, 0, 12]] },
                { type: 'samurai', pos: [-4, 0, -6], wp: [[-4, 0, -10], [-4, 0, -2]] },
                { type: 'samurai', pos: [4, 0, -6], wp: [[4, 0, -10], [4, 0, -2]] },
                { type: 'samurai', pos: [0, 0, -24], wp: [[-4, 0, -24], [4, 0, -24]] }
            ]
        },
        {
            id: 42,
            mapId: 3,
            levelNum: 12,
            title: "Wrath of the Temple",
            desc: "Survive an overwhelming onslaught of Raizen's elite imperial guard.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -34],
            targetName: "Grand Staircase",
            rewardRyo: 1250,
            enemies: [
                { type: 'scout', pos: [-6, 0, 10], wp: [[-6, 0, 6], [-6, 0, 14]] },
                { type: 'scout', pos: [6, 0, 10], wp: [[6, 0, 6], [6, 0, 14]] },
                { type: 'samurai', pos: [-4, 0, -4], wp: [[-4, 0, -8], [-4, 0, 0]] },
                { type: 'samurai', pos: [4, 0, -4], wp: [[4, 0, -8], [4, 0, 0]] },
                { type: 'spellcaster', pos: [0, 0, -20], wp: [[-5, 0, -20], [5, 0, -20]] }
            ]
        },
        {
            id: 43,
            mapId: 3,
            levelNum: 13,
            title: "The Shadow Vessel",
            desc: "Defeat Raizen's primary shadow clone harboring half of the warlord's power.",
            difficulty: "Mini-Boss",
            playerSpawn: [0, 0, 22],
            targetPos: [0, 0, -24],
            targetName: "Vessel Pedestal",
            rewardRyo: 1500,
            enemies: [
                { type: 'miniboss', pos: [0, 0, -18], wp: [[-6, 0, -18], [6, 0, -18]] },
                { type: 'samurai', pos: [-5, 0, -4], wp: [[-5, 0, -8], [-5, 0, 0]] },
                { type: 'spellcaster', pos: [5, 0, -4], wp: [[5, 0, -8], [5, 0, 0]] }
            ]
        },
        {
            id: 44,
            mapId: 3,
            levelNum: 14,
            title: "The Final Approach",
            desc: "Fight through the throne room ante-chamber where Raizen prepares the dimensional collapse.",
            difficulty: "Very Hard",
            playerSpawn: [0, 0, 24],
            targetPos: [0, 0, -36],
            targetName: "Throne Gates",
            rewardRyo: 1800,
            enemies: [
                { type: 'samurai', pos: [-5, 0, 8], wp: [[-5, 0, 4], [-5, 0, 12]] },
                { type: 'samurai', pos: [5, 0, 8], wp: [[5, 0, 4], [5, 0, 12]] },
                { type: 'spellcaster', pos: [-4, 0, -8], wp: [[-4, 0, -12], [-4, 0, -4]] },
                { type: 'spellcaster', pos: [4, 0, -8], wp: [[4, 0, -4], [4, 0, -12]] },
                { type: 'miniboss', pos: [0, 0, -24], wp: [[-5, 0, -24], [5, 0, -24]] }
            ]
        },
        {
            id: 45,
            mapId: 3,
            levelNum: 15,
            title: "The Last Shadow",
            desc: "FINAL CONFRONTATION: Defeat Lord Raizen in all 3 phases and save the world from eternal darkness!",
            difficulty: "Final Boss",
            playerSpawn: [0, 0, 20],
            targetPos: [0, 0, -18],
            targetName: "Throne of the Void",
            rewardRyo: 5000,
            enemies: [
                { type: 'finalboss', pos: [0, 0, -16], wp: [[-8, 0, -16], [8, 0, -16]] }
            ]
        }
    ],

    // All 7 Eye Powers / Dōjutsu (Fully functional, no paywalls)
    eyes: [
        {
            id: 'sharingan3',
            name: "Three-Tomoe Sharingan",
            icon: "👁️",
            desc: "Enhances perception, granting +25% attack speed and slowing nearby enemies during dodges.",
            color: "#FF1744",
            cost: 0, // Unlocked by default
            isEquipped: true,
            effect: { type: 'speed_perception', bonusAtkSpeed: 0.25, slowRadius: 4.0 }
        },
        {
            id: 'mangekyo',
            name: "Mangekyo Sharingan",
            icon: "🔥",
            desc: "Ignites dark black flames upon sword impacts, dealing extra burn damage over time.",
            color: "#D50000",
            cost: 600,
            isEquipped: false,
            effect: { type: 'burn_damage', burnDamage: 15 }
        },
        {
            id: 'byakugan',
            name: "Byakugan",
            icon: "⚪",
            desc: "Grants 360-degree chakra vision, revealing enemy weak points for +30% critical hit chance.",
            color: "#E0F7FA",
            cost: 800,
            isEquipped: false,
            effect: { type: 'crit_chance', critRate: 0.3 }
        },
        {
            id: 'kakashi_eye',
            name: "Kakashi Eye",
            icon: "🌀",
            desc: "Enables Kamui spatial distortion, granting invulnerability frames and instant teleport counters.",
            color: "#B71C1C",
            cost: 1100,
            isEquipped: false,
            effect: { type: 'teleport_counter', iFrames: 0.5 }
        },
        {
            id: 'eternal_mangekyo',
            name: "Eternal Mangekyo Sharingan",
            icon: "🩸",
            desc: "Mastery over eternal light. +40% sword damage and cuts ability cooldowns by 30%.",
            color: "#880E4F",
            cost: 1600,
            isEquipped: false,
            effect: { type: 'cdr_power', damageBonus: 0.4, cdr: 0.3 }
        },
        {
            id: 'jougan',
            name: "Jougan (Pure Eye)",
            icon: "💠",
            desc: "Aura perception across dimensions. Absorbs enemy chakra upon hits to refill your chakra pool.",
            color: "#00E5FF",
            cost: 2200,
            isEquipped: false,
            effect: { type: 'chakra_steal', stealAmount: 8 }
        },
        {
            id: 'rinnegan',
            name: "Rinnegan",
            icon: "🟣",
            desc: "Divine eye of six paths. Tap Eye ability key to trigger Almighty Push (Shinra Tensei) clearing all foes!",
            color: "#9C27B0",
            cost: 3000,
            isEquipped: false,
            effect: { type: 'almighty_push', pushRadius: 10.0, damage: 80 }
        }
    ],

    // All Weapons
    weapons: [
        {
            id: 'reaper_scythe',
            name: "Reaper Scythe",
            icon: "⚔️",
            desc: "Kadaya's signature curved scythe with sweeping horizontal cleaves and wide reach.",
            damage: 28,
            speed: 1.1,
            range: 2.5,
            cost: 0,
            isEquipped: true
        },
        {
            id: 'shadow_katana',
            name: "Shadow Katana",
            icon: "🗡️",
            desc: "Balanced razor-sharp shinobi blade for rapid combination strikes.",
            damage: 24,
            speed: 1.35,
            range: 2.0,
            cost: 500,
            isEquipped: false
        },
        {
            id: 'nodachi',
            name: "Heavy Nodachi",
            icon: "🗡️",
            desc: "Massive two-handed greatsword with staggering heavy impact and ground shockwaves.",
            damage: 42,
            speed: 0.85,
            range: 2.8,
            cost: 900,
            isEquipped: false
        },
        {
            id: 'twin_daggers',
            name: "Twin Shinobi Daggers",
            icon: "🗡️",
            desc: "Dual swift blades dealing high-frequency flurry cuts.",
            damage: 18,
            speed: 1.6,
            range: 1.6,
            cost: 1200,
            isEquipped: false
        },
        {
            id: 'muramasa',
            name: "Cursed Blade Muramasa",
            icon: "🩸",
            desc: "Cursed crimson katana that drains enemy life force to heal the wielder.",
            damage: 36,
            speed: 1.2,
            range: 2.2,
            cost: 2000,
            isEquipped: false
        },
        {
            id: 'celestial_blade',
            name: "Celestial Sun Blade",
            icon: "✨",
            desc: "Legendary blade consecrated in solar energy, disintegrating shadow armor.",
            damage: 48,
            speed: 1.25,
            range: 2.4,
            cost: 3200,
            isEquipped: false
        }
    ],

    // Susanoo Spectral Armor Forms
    susanoo: [
        {
            id: 'azure_susanoo',
            name: "Azure Susanoo",
            icon: "🛡️",
            desc: "Manifests a colossal glowing azure spectral warrior and blade. Grants 75% damage reduction and massive spirit slashes.",
            color: "#00E5FF",
            duration: 12.0,
            cost: 1500,
            isEquipped: true
        },
        {
            id: 'crimson_susanoo',
            name: "Crimson Susanoo",
            icon: "👹",
            desc: "Manifests an armored demonic crimson titan wielding twin blazing swords. Maximum destructive power.",
            color: "#FF1744",
            duration: 15.0,
            cost: 2500,
            isEquipped: false
        }
    ],

    // Core Abilities
    abilities: [
        {
            id: 'scythe_combo',
            name: "Scythe Combo",
            icon: "⚔️",
            desc: "Three-hit devastating sweeping scythe combo with finisher leap.",
            cooldown: 0.35,
            cost: 0
        },
        {
            id: 'shuriken_jutsu',
            name: "Shuriken Jutsu",
            icon: "⭐",
            desc: "Hurl 3 razor chakra shurikens in a spreading trajectory.",
            cooldown: 2.5,
            cost: 300
        },
        {
            id: 'kenjutsu',
            name: "Kenjutsu Flurry",
            icon: "🗡️",
            desc: "Unleash a high-speed five-slash sword sequence cutting all forward targets.",
            cooldown: 3.5,
            cost: 500
        },
        {
            id: 'hidden_jutsu',
            name: "Hidden Jutsu (Stealth)",
            icon: "🌫️",
            desc: "Vanish into shadowy smoke. Enemies lose aggro and your next strike deals triple damage.",
            cooldown: 6.0,
            cost: 800
        },
        {
            id: 'shadow_clone',
            name: "Shadow Clone",
            icon: "👥",
            desc: "Manifest 2 tactical shadow clones that fight alongside you for 10 seconds.",
            cooldown: 10.0,
            cost: 1000
        },
        {
            id: 'teleport_kunai',
            name: "Teleportation Kunai",
            icon: "⚡",
            desc: "Throw a marked kunai and instantly warp behind the struck target with a strike.",
            cooldown: 4.5,
            cost: 1200
        },
        {
            id: 'rasengan_sphere',
            name: "Spiral Chakra Sphere",
            icon: "🔮",
            desc: "Thrust a grinding vortex of compressed shadow chakra, blasting enemies through obstacles.",
            cooldown: 7.0,
            cost: 1500
        }
    ],

    // Complete 29 Summons across 11 categories
    summons: [
        // 5 Toads
        { id: 'toad_bunta', category: 'Toads', name: "Chief Gamabunta", icon: "🐸", desc: "Giant toad warrior wielding a giant tanto blade.", cost: 800, hp: 300, dmg: 40 },
        { id: 'toad_kichi', category: 'Toads', name: "Gamakichi", icon: "🐸", desc: "Nimble jumping toad launching fiery spit projectiles.", cost: 400, hp: 180, dmg: 25 },
        { id: 'toad_iron', category: 'Toads', name: "Iron Toad", icon: "🐸", desc: "Armored toad with impenetrable defense.", cost: 600, hp: 450, dmg: 20 },
        { id: 'toad_mountain', category: 'Toads', name: "Mountain Toad", icon: "🐸", desc: "Heavy ground-slamming toad producing rock fissures.", cost: 700, hp: 350, dmg: 32 },
        { id: 'toad_stone', category: 'Toads', name: "Stone Toad", icon: "🐸", desc: "Stationary stone toad that reflects enemy ranged attacks.", cost: 500, hp: 400, dmg: 18 },

        // 4 Dogs
        { id: 'dog_pakku', category: 'Dogs', name: "Pakku Hound", icon: "🐕", desc: "Keen tracker dog that marks and debuffs enemies.", cost: 350, hp: 160, dmg: 22 },
        { id: 'dog_shadow', category: 'Dogs', name: "Shadow Hound", icon: "🐕", desc: "Dark spectral hound that bites and pins enemy ankles.", cost: 500, hp: 200, dmg: 28 },
        { id: 'dog_fang', category: 'Dogs', name: "Iron Fang", icon: "🐕", desc: "Armored combat dog with savage bite attacks.", cost: 600, hp: 240, dmg: 34 },
        { id: 'dog_tracker', category: 'Dogs', name: "Blood Tracker Dog", icon: "🐕", desc: "Locates hidden archers and disrupts enemy casting.", cost: 450, hp: 180, dmg: 26 },

        // 4 Birds
        { id: 'bird_raven', category: 'Birds', name: "Shadow Raven", icon: "🦅", desc: "Swarm of ravens blinding enemies and reducing their accuracy.", cost: 400, hp: 140, dmg: 20 },
        { id: 'bird_falcon', category: 'Birds', name: "Hunting Falcon", icon: "🦅", desc: "High-speed aerial dives striking enemy eyes.", cost: 500, hp: 160, dmg: 30 },
        { id: 'bird_eagle', category: 'Birds', name: "Storm Eagle", icon: "🦅", desc: "Summons gusting wind currents that knock back enemies.", cost: 700, hp: 220, dmg: 35 },
        { id: 'bird_phoenix', category: 'Birds', name: "Vermilion Phoenix", icon: "🦅", desc: "Fiery bird dropping incendiary feathers.", cost: 1100, hp: 260, dmg: 48 },

        // 5 Snakes
        { id: 'snake_aoda', category: 'Snakes', name: "Blue Serpent Aoda", icon: "🐍", desc: "Massive agile blue serpent constricting groups of foes.", cost: 850, hp: 320, dmg: 38 },
        { id: 'snake_manda', category: 'Snakes', name: "Colossal Manda", icon: "🐍", desc: "Fierce purple viper with venom breath.", cost: 1200, hp: 400, dmg: 50 },
        { id: 'snake_viper', category: 'Snakes', name: "Shadow Viper", icon: "🐍", desc: "Stealthy poisonous serpent inflicting poison over time.", cost: 450, hp: 180, dmg: 24 },
        { id: 'snake_cobra', category: 'Snakes', name: "Pit Cobra", icon: "🐍", desc: "Spits blinding venom into forward cone.", cost: 550, hp: 200, dmg: 28 },
        { id: 'snake_twins', category: 'Snakes', name: "Twin Serpents", icon: "🐍", desc: "Dual vipers striking simultaneously.", cost: 750, hp: 280, dmg: 36 },

        // 1 Slug
        { id: 'slug_katsuyu', category: 'Slug', name: "Lady Katsuyu", icon: "🐌", desc: "Sacred slug that constantly restores Kadaya's health and stamina.", cost: 1000, hp: 500, dmg: 10, isHealer: true },

        // 1 Turtle
        { id: 'turtle_iron', category: 'Turtle', name: "Armored Iron Turtle", icon: "🐢", desc: "Fortress turtle taunting all enemies and absorbing all strikes.", cost: 650, hp: 600, dmg: 15 },

        // 1 Wolf
        { id: 'wolf_midnight', category: 'Wolf', name: "Midnight Shadow Wolf", icon: "🐺", desc: "Fearsome wolf howling to boost party attack power by 30%.", cost: 700, hp: 240, dmg: 36 },

        // 1 Panther
        { id: 'panther_black', category: 'Panther', name: "Obsidian Panther", icon: "🐆", desc: "Leaping assassin cat shredding enemy rear guards.", cost: 750, hp: 220, dmg: 42 },

        // 1 Dragon
        { id: 'dragon_shadow', category: 'Dragon', name: "Shadow Void Dragon", icon: "🐉", desc: "Spectacular dark dragon breathing torrents of purple plasma.", cost: 1800, hp: 500, dmg: 65 },

        // 1 Shadow Beast
        { id: 'beast_void', category: 'Shadow Beast', name: "Beast of the Void", icon: "👾", desc: "Amorphous shadowy horror pulling enemies into vortexes.", cost: 1400, hp: 450, dmg: 55 },

        // 5 Legendary Summons
        { id: 'leg_kirin', category: 'Legendary', name: "Celestial Kirin", icon: "⚡", desc: "Thunder beast summoning lightning strikes from the heavens.", cost: 2000, hp: 550, dmg: 70 },
        { id: 'leg_nine_tails', category: 'Legendary', name: "Nine-Tails Shadow Spirit", icon: "🦊", desc: "Colossal nine-tailed chakra entity firing dark spirit bombs.", cost: 3000, hp: 800, dmg: 90 },
        { id: 'leg_suzaku', category: 'Legendary', name: "Suzaku the Blazing Lord", icon: "🔥", desc: "Sacred southern beast raining down divine crimson flames.", cost: 2200, hp: 600, dmg: 75 },
        { id: 'leg_byakko', category: 'Legendary', name: "Byakko the White Tiger", icon: "🐅", desc: "Mythic white tiger whose claws generate sonic slicing waves.", cost: 2100, hp: 580, dmg: 72 },
        { id: 'leg_genbu', category: 'Legendary', name: "Genbu the Obsidian Guardian", icon: "🛡️", desc: "Ancient black warrior providing full immunity to knockback.", cost: 2300, hp: 850, dmg: 60 }
    ],

    // Upgrades Dojo
    upgrades: [
        { id: 'max_hp', name: "Vitality Force (HP)", desc: "+20 Max Health per rank", rank: 1, maxRank: 10, baseCost: 150 },
        { id: 'atk_power', name: "Scythe Mastery (ATK)", desc: "+15% Base Damage per rank", rank: 1, maxRank: 10, baseCost: 200 },
        { id: 'atk_speed', name: "Shinobi Agility (SPD)", desc: "+10% Attack Speed per rank", rank: 1, maxRank: 10, baseCost: 200 },
        { id: 'move_speed', name: "Wind Strider (Move)", desc: "+8% Movement & Sprint Speed", rank: 1, maxRank: 5, baseCost: 250 },
        { id: 'dash_cooldown', name: "Shadow Step (Dash CD)", desc: "-15% Dash Cooldown per rank", rank: 1, maxRank: 5, baseCost: 300 },
        { id: 'chakra_pool', name: "Chakra Reservoir", desc: "+25 Max Chakra per rank", rank: 1, maxRank: 8, baseCost: 200 },
        { id: 'reaper_duration', name: "Reaper Awakening", desc: "+3s Grim Reaper Transformation time", rank: 1, maxRank: 5, baseCost: 400 },
        { id: 'summon_mastery', name: "Summoner Bond", desc: "+25% Summon Health & Damage", rank: 1, maxRank: 5, baseCost: 350 }
    ],

    // Story Dialogues
    dialogues: {
        prologue: [
            { speaker: "Krayoo", text: "Kadaya! The northern sky... it has turned blood-crimson. Look at the ancient lotus seal above the village!" },
            { speaker: "Kadaya", text: "Raizen's shadow army has breached the perimeter. Krayoo, take the younger acolytes to the mountain tunnel." },
            { speaker: "Krayoo", text: "I'm not leaving you behind, brother! My daggers are ready. We fight together!" },
            { speaker: "Raizen", text: "Foolish children of the Lotus. The boundary between the living and the dead dissolves tonight. Surrender the Scythe of the Eclipse!" },
            { speaker: "Kadaya", text: "Over my cold corpse, Raizen. The shadow power in my blood belongs to the light!" }
        ],
        chapter1_intro: [
            { speaker: "Kadaya", text: "The Blood Moon Forest has been overrun. Scouting parties are roaming the paths." },
            { speaker: "Krayoo", text: "I will watch your flanks. Strike down their scouts and recover the stolen ancestral scrolls!" }
        ],
        chapter2_intro: [
            { speaker: "Krayoo", text: "This graveyard... the graves have been torn open from the inside. Raizen is raising the dead." },
            { speaker: "Kadaya", text: "The ancient warriors deserve peace. Let our blades grant them their eternal rest." }
        ],
        chapter3_intro: [
            { speaker: "Krayoo", text: "The Burning Temple is ahead! The heat is suffocating... Raizen is inside the inner sanctum." },
            { speaker: "Kadaya", text: "This ends here, Krayoo. Prepare the summoning seals. Tonight, the Last Shadow falls!" }
        ],
        final_boss_intro: [
            { speaker: "Raizen", text: "You have walked across fields of ash to reach me, Kadaya. But your petty ninja arts are nothing before the Void God!" },
            { speaker: "Kadaya", text: "You took our village, Raizen. But you failed to extinguish our will. Behold the true Grim Reaper form!" },
            { speaker: "Raizen", text: "Then let us paint the shattered altar with your blood!" }
        ],
        victory_ending: [
            { speaker: "Kadaya", text: "It is done. The rift is sealed, and the Blood Moon fades." },
            { speaker: "Krayoo", text: "The Lotus village will rebuild, Kadaya. The realm is safe, thanks to the Last Shadow." }
        ]
    }
};
