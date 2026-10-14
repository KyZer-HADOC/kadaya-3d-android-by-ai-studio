// Audio Engine for KADAYA: THE LAST SHADOW
// Procedural audio synthesizer using Web Audio API

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterVolume = 0.8;
        this.musicVolume = 0.55;
        this.sfxVolume = 0.85;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.isPlayingMusic = false;
        this.musicTimer = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        if (this.ctx.state === 'suspended') {
            const unlock = () => {
                this.ctx.resume();
                window.removeEventListener('click', unlock);
                window.removeEventListener('touchstart', unlock);
                window.removeEventListener('keydown', unlock);
            };
            window.addEventListener('click', unlock);
            window.addEventListener('touchstart', unlock);
            window.addEventListener('keydown', unlock);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(muted ? 0 : this.masterVolume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }

    // Reaper Transformation Audio Cue
    playReaperTransformation() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;

        // Deep resonant dark gong
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(75, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 2.0);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 2.0);

        // Rising spectral whoosh
        const rise = this.ctx.createOscillator();
        rise.type = 'sine';
        rise.frequency.setValueAtTime(140, t);
        rise.frequency.exponentialRampToValueAtTime(880, t + 0.8);

        const riseGain = this.ctx.createGain();
        riseGain.gain.setValueAtTime(0.01, t);
        riseGain.gain.linearRampToValueAtTime(0.4, t + 0.5);
        riseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        rise.connect(riseGain);
        riseGain.connect(this.sfxGain);
        rise.start(t);
        rise.stop(t + 1.2);
    }

    // Reaper Scythe Heavy Attack
    playScytheAttack() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;

        // Heavy whoosh with low sub
        const sub = this.ctx.createOscillator();
        sub.type = 'triangle';
        sub.frequency.setValueAtTime(120, t);
        sub.frequency.exponentialRampToValueAtTime(45, t + 0.25);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(0.6, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        sub.connect(subGain);
        subGain.connect(this.sfxGain);
        sub.start(t);
        sub.stop(t + 0.25);

        this.playSwordSwing(0.75);
    }

    // Shinra Tensei / Almighty Push
    playAlmightyPush() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.8);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.8);
    }

    // Dōjutsu Eye Activation Chime
    playEyeActivation() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.04);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.2, t + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.3);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + idx * 0.04);
            osc.stop(t + idx * 0.04 + 0.35);
        });
    }

    // Susanoo Roar
    playSusanooRoar() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.linearRampToValueAtTime(90, t + 0.6);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.9);
    }

    // Summoning Circle
    playSummonCircle() {
        if (!this.ctx || this.isMuted) return;
        this.playAlmightyPush();
        this.playEyeActivation();
    }

    // Sword Swing
    playSwordSwing(pitch = 1.0) {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.16;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600 * pitch, t);
        filter.frequency.exponentialRampToValueAtTime(1800 * pitch, t + 0.07);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.65, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.16);
    }

    // Hit Impact
    playHitImpact(isHeavy = false) {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isHeavy ? 180 : 240, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(isHeavy ? 0.9 : 0.6, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.2);
    }

    // Shadow Dash
    playShadowDash() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.25);
    }

    playWindStrike() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.15);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.35);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.35);
    }

    playSpiralSphere() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.linearRampToValueAtTime(700, t + 0.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.5);
    }

    playFootstep() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.08);
    }

    playJump() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(340, t + 0.15);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.15);
    }

    playVictory() {
        if (!this.ctx || this.isMuted) return;
        [220, 277.18, 329.63, 440, 554.37, 659.25].forEach((freq, idx) => {
            const t = this.ctx.currentTime + idx * 0.12;
            const osc = this.ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t);
            osc.stop(t + 0.45);
        });
    }

    startMusic() {
        if (this.isPlayingMusic) return;
        this.isPlayingMusic = true;
        let beat = 0;
        const notes = [146.83, 155.56, 196.00, 220.00, 261.63, 293.66, 311.13, 392.00, 440.00];

        const step = () => {
            if (!this.isPlayingMusic || !this.ctx) return;
            const t = this.ctx.currentTime;

            if (beat % 4 === 0) {
                const drum = this.ctx.createOscillator();
                drum.type = 'sine';
                drum.frequency.setValueAtTime(85, t);
                drum.frequency.exponentialRampToValueAtTime(32, t + 0.35);

                const drumGain = this.ctx.createGain();
                drumGain.gain.setValueAtTime(0.4, t);
                drumGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

                drum.connect(drumGain);
                drumGain.connect(this.musicGain);
                drum.start(t);
                drum.stop(t + 0.35);
            }

            if (Math.random() > 0.35) {
                const note = notes[Math.floor(Math.random() * notes.length)];
                const flute = this.ctx.createOscillator();
                flute.type = 'sine';
                flute.frequency.setValueAtTime(note, t);

                const fluteGain = this.ctx.createGain();
                fluteGain.gain.setValueAtTime(0.01, t);
                fluteGain.gain.linearRampToValueAtTime(0.12, t + 0.08);
                fluteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

                flute.connect(fluteGain);
                fluteGain.connect(this.musicGain);
                flute.start(t);
                flute.stop(t + 0.7);
            }

            beat++;
            this.musicTimer = setTimeout(step, 400);
        };
        step();
    }

    stopMusic() {
        this.isPlayingMusic = false;
        if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
    }
}

window.soundEngine = new SoundEngine();
