/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientNode: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private fireplaceNoise: AudioWorkletNode | ScriptProcessorNode | null = null;
  private fireplaceGain: GainNode | null = null;
  private isAmbiencePlaying = false;
  private isFireplacePlaying = false;
  private sequencerTimer: number | null = null;

  init() {
    if (!this.ctx) {
      // Use standard or webkit AudioContext
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a simple musical note with a beautiful synthesizer envelope
  playNote(frequency: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine', duration = 0.8) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // Filter to make it warmer
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'sine' ? 2000 : 800, this.ctx.currentTime);

    // Simple Synth Envelope
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    // Attack
    gainNode.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05);
    // Decay and Release
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // A beautiful magical chime when discovering clues or solving puzzles
  playChime() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.6);
    });
  }

  // Sound of a candle blowing out (short puff of white noise)
  playBlowWind() {
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.4; // 0.4 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseSource.start();
  }

  // Party horn sound (cheerful, brassy, slightly silly!)
  playPartyHorn() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 233.08; // Bb3
    
    // Multi-oscillator brassy sound
    for (let i = 1; i <= 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = i === 1 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * i, now);
      
      // Vibrato/tremolo to make it horn-like
      osc.frequency.linearRampToValueAtTime(baseFreq * i * 1.05, now + 0.15);
      osc.frequency.linearRampToValueAtTime(baseFreq * i * 0.98, now + 0.3);
      osc.frequency.linearRampToValueAtTime(baseFreq * i * 1.02, now + 0.5);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12 / i, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.6);
    }
  }

  // Sparkle magical sound (water ripples, garden sprouts)
  playSparkle() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      const delay = i * 0.06;
      const freq = 800 + Math.random() * 1200;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    }
  }

  // Sound of opening a safe or wooden door (low creak + click)
  playDoorCreak() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.linearRampToValueAtTime(45, now + 1.2);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 1.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);

    // Subtle creaks using quick high frequency filter modulations
    for (let i = 0; i < 4; i++) {
      const clickDelay = 0.2 + i * 0.25;
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      
      clickOsc.type = 'sawtooth';
      clickOsc.frequency.setValueAtTime(100 + Math.random() * 80, now + clickDelay);
      
      clickGain.gain.setValueAtTime(0, now + clickDelay);
      clickGain.gain.linearRampToValueAtTime(0.05, now + clickDelay + 0.01);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + clickDelay + 0.1);
      
      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(300, now + clickDelay);
      
      clickOsc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      
      clickOsc.start(now + clickDelay);
      clickOsc.stop(now + clickDelay + 0.12);
    }
  }

  // Confetti pop (thump + quick crackles)
  playConfettiPop() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Thump
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(150, now);
    thump.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    
    thumpGain.gain.setValueAtTime(0.4, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    thump.connect(thumpGain);
    thumpGain.connect(this.ctx.destination);
    thump.start(now);
    thump.stop(now + 0.2);

    // Sparkles
    this.playSparkle();
  }

  // Fireplace Crackle generator using procedural audio (Web Audio API)
  startFireplace() {
    this.init();
    if (!this.ctx || this.isFireplacePlaying) return;

    this.isFireplacePlaying = true;
    this.fireplaceGain = this.ctx.createGain();
    this.fireplaceGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.fireplaceGain.connect(this.ctx.destination);

    const isScriptProcessorSupported = 'createScriptProcessor' in this.ctx;
    if (isScriptProcessorSupported) {
      // Create crackling fireplace nodes using a simple script processor noise generator
      try {
        const bufferSize = 4096;
        const scriptNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
        
        scriptNode.onaudioprocess = (e) => {
          const output = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            // Generate basic low rumble noise + crackly impulses
            let crackle = 0;
            if (Math.random() < 0.0006) {
              crackle = (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.6);
            }
            output[i] = white * 0.04 + crackle * 0.5;
          }
        };

        const fireplaceFilter = this.ctx.createBiquadFilter();
        fireplaceFilter.type = 'lowpass';
        fireplaceFilter.frequency.setValueAtTime(600, this.ctx.currentTime);

        scriptNode.connect(fireplaceFilter);
        fireplaceFilter.connect(this.fireplaceGain);
        this.fireplaceNoise = scriptNode as any;
      } catch (err) {
        console.error('Failed to start script processor for fireplace noise', err);
      }
    }
  }

  stopFireplace() {
    if (this.fireplaceNoise) {
      try {
        this.fireplaceNoise.disconnect();
      } catch (e) {}
      this.fireplaceNoise = null;
    }
    if (this.fireplaceGain) {
      try {
        this.fireplaceGain.disconnect();
      } catch (e) {}
      this.fireplaceGain = null;
    }
    this.isFireplacePlaying = false;
  }

  // Generative, beautiful ambient background music sequence (Lofi cozy piano vibes)
  startAmbience() {
    this.init();
    if (!this.ctx || this.isAmbiencePlaying) return;

    this.isAmbiencePlaying = true;
    
    // Pentatonic scale notes to choose from (C major pentatonic: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5)
    const scale = [
      261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
      523.25, 587.33, 659.25, 783.99, 880.00, // Octave 5
      1046.50 // C6
    ];

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [349.23, 440.00, 523.25, 587.33], // Fmaj7 (F4, A4, C5, D5)
      [392.00, 493.88, 587.33, 659.25], // G6 (G4, B4, D5, E5)
      [220.00, 329.63, 392.00, 523.25]  // Am7 (A3, E4, G4, C5)
    ];

    let chordIndex = 0;
    let stepCount = 0;

    const playStep = () => {
      if (!this.isAmbiencePlaying || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Play a soft chord on step 0 and 8
      if (stepCount % 8 === 0) {
        const currentChord = chords[chordIndex];
        currentChord.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.04, now + 0.5); // very slow attack
          gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8); // long decay

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(now);
          osc.stop(now + 4);
        });

        chordIndex = (chordIndex + 1) % chords.length;
      }

      // Play a sparkling melodic note sometimes (70% chance on off-beats)
      if (Math.random() < 0.6) {
        const noteIndex = Math.floor(Math.random() * scale.length);
        const freq = scale[noteIndex];
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        // filter sweep!
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 1.5);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        // Simple stereo delay simulation using an empty gain with duration delay
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2);
      }

      stepCount = (stepCount + 1) % 16;
      // Schedule next step in 500ms (120 BPM on 8th notes)
      this.sequencerTimer = window.setTimeout(playStep, 500);
    };

    playStep();
  }

  stopAmbience() {
    this.isAmbiencePlaying = false;
    if (this.sequencerTimer) {
      clearTimeout(this.sequencerTimer);
      this.sequencerTimer = null;
    }
  }

  toggleAmbience() {
    if (this.isAmbiencePlaying) {
      this.stopAmbience();
      return false;
    } else {
      this.startAmbience();
      return true;
    }
  }

  getIsAmbiencePlaying() {
    return this.isAmbiencePlaying;
  }
}

export const audioEngine = new AudioEngine();
