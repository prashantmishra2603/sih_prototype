// High-fidelity, ultra-subtle Web Audio API micro-sounds
// Zero external assets, zero latency, tasteful Apple/Linear-style sound design

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bidcheck_sound_enabled', enabled ? 'true' : 'false');
    }
  }

  isEnabled() {
    return this.enabled;
  }

  // Soft tactile click (haptic feel, 25ms)
  playTap() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.028);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Elegant two-tone bell chime (F#5 -> A5)
  playNotification() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Note 1: F#5 (740Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(739.99, t);
      gain1.gain.setValueAtTime(0.08, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.29);

      // Note 2: A5 (880Hz) with slight delay
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, t + 0.09);
      gain2.gain.setValueAtTime(0.0001, t);
      gain2.gain.setValueAtTime(0.09, t + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t + 0.09);
      osc2.stop(t + 0.43);
    } catch {
      // Ignore audio error
    }
  }

  // Subtle upward chime / swoosh for export
  playExport() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.18); // A4 -> C6

      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.23);
    } catch {
      // Ignore
    }
  }

  // Crisp confirmation tap for document upload/import
  playImport() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.06);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch {
      // Ignore
    }
  }

  // 1. RESULT: PASS / APPROVED
  // Crisp, uplifting harmonic triad (C6 -> E6 -> G6)
  playPass() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const notes = [
        { freq: 1046.5, delay: 0.00, dur: 0.22, vol: 0.07 }, // C6
        { freq: 1318.5, delay: 0.07, dur: 0.24, vol: 0.08 }, // E6
        { freq: 1567.98, delay: 0.14, dur: 0.38, vol: 0.09 } // G6
      ];

      notes.forEach(({ freq, delay, dur, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.setValueAtTime(vol, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + dur + 0.02);
      });
    } catch {
      // Ignore
    }
  }

  // 2. RESULT: UNDER REVIEW / ATTENTION NEEDED
  // Warm, neutral two-tone marimba chime (E5 -> G5)
  playReview() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const notes = [
        { freq: 659.25, delay: 0.00, dur: 0.25, vol: 0.08 }, // E5
        { freq: 783.99, delay: 0.10, dur: 0.32, vol: 0.07 }  // G5
      ];

      notes.forEach(({ freq, delay, dur, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.setValueAtTime(vol, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + dur + 0.02);
      });
    } catch {
      // Ignore
    }
  }

  // 3. RESULT: FAIL / DISQUALIFIED
  // Tasteful, dignified low muted double-thud (D3 / 146Hz, soft tone, never harsh or annoying)
  playFail() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const notes = [
        { freq: 175, delay: 0.00, dur: 0.16, vol: 0.09 },
        { freq: 140, delay: 0.10, dur: 0.24, vol: 0.08 }
      ];

      notes.forEach(({ freq, delay, dur, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle'; // softer than square/sawtooth, pleasant low thud
        osc.frequency.setValueAtTime(freq, t + delay);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.75, t + delay + dur);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.setValueAtTime(vol, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + dur + 0.02);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
