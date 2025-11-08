// services/SoundService.js
class SoundService {
  constructor() {
    this.sounds = new Map();
    this.volume = 0.7;
    this.muted = false;
    this.audioContext = null;
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      await this.initAudioContext();
      await this.preloadRealSounds(); // Only load real files for specific sounds
      this.isInitialized = true;
      console.log('SoundService initialized - using mixed real files + generated tones');
    } catch (error) {
      console.warn('SoundService initialization completed with fallbacks:', error);
      this.isInitialized = true;
    }
  }

  async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const resumeAudio = () => {
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      };
      
      document.addEventListener('click', resumeAudio, { once: true });
      document.addEventListener('touchstart', resumeAudio, { once: true });
      
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  async preloadRealSounds() {
    // ONLY load these two sounds as real MP3 files
    const realSoundFiles = {
      buttonClick: '/sounds/button-click.mp3',    // Your MP3 file
      backgroundMusic: '/sounds/background-music.mp3', // Your MP3 file
      slideClick: '/sounds/slide-click.mp3'
    };

    console.log('Preloading real sound files for buttonClick and backgroundMusic');

    const loadPromises = [];
    
    for (const [name, url] of Object.entries(realSoundFiles)) {
      loadPromises.push(
        this.loadRealSound(name, url).catch(error => {
          console.warn(`Failed to load real ${name} from ${url}, will use generated tones`);
          return null;
        })
      );
    }

    await Promise.allSettled(loadPromises);
  }

  async loadRealSound(name, url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      
      const loadTimeout = setTimeout(() => {
        reject(new Error(`Sound loading timeout: ${name}`));
      }, 5000);

      const handleLoad = () => {
        clearTimeout(loadTimeout);
        this.sounds.set(name, audio);
        console.log(`✅ Successfully loaded real sound: ${name}`);
        resolve(audio);
      };

      const handleError = (e) => {
        clearTimeout(loadTimeout);
        console.error(`❌ Failed to load real sound: ${name}`, e);
        reject(new Error(`Failed to load real sound: ${name}`));
      };

      if (audio.readyState >= 3) {
        handleLoad();
      } else {
        audio.addEventListener('canplaythrough', handleLoad, { once: true });
        audio.addEventListener('loadeddata', handleLoad, { once: true });
        audio.addEventListener('error', handleError, { once: true });
      }

      audio.load();
    });
  }

  // Web Audio API tone generation (for all other sounds)
  generateTone(frequency, duration, type = 'sine', volume = 1.0) {
    if (!this.audioContext || this.muted) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      const finalVolume = this.volume * volume * 0.1;
      const now = this.audioContext.currentTime;
      
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(finalVolume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      oscillator.start(now);
      oscillator.stop(now + duration);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
      
    } catch (error) {
      console.warn('Tone generation failed:', error);
    }
  }

  // Play methods - only buttonClick and backgroundMusic use real files
  async playSound(name, fallbackTone) {
    if (this.muted || !this.isInitialized) return;

    if (!this.isInitialized) {
      setTimeout(() => this.playSound(name, fallbackTone), 100);
      return;
    }

    // Try to play preloaded real sound (only for buttonClick and backgroundMusic)
    const sound = this.sounds.get(name);
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.volume = this.volume;
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
          await playPromise;
        }
        return;
      } catch (error) {
        console.warn(`Failed to play real ${name}:`, error);
        // Continue to fallback
      }
    }

    // Fallback to generated tone for all sounds
    if (fallbackTone) {
      console.log(`Using generated tone for: ${name}`);
      fallbackTone();
    }
  }

  // REAL MP3 SOUNDS (only these two use actual files)
  async buttonClick() {
    await this.playSound('buttonClick', () => {
      // Fallback generated tone if MP3 fails
      this.generateTone(700, 0.1, 'sine', 0.5);
      setTimeout(() => {
        this.generateTone(550, 0.08, 'sine', 0.3);
      }, 80);
    });
  }
  async slideClick() {
    await this.playSound('slideClick', () => {
      // Fallback generated tone if MP3 fails
      this.generateTone(700, 0.1, 'sine', 0.5);
      setTimeout(() => {
        this.generateTone(550, 0.08, 'sine', 0.3);
      }, 80);
    });
  }

  async playBackgroundMusic() {
    console.log(this.muted, this.isInitialized,"playground music triggered")
    if (this.muted || !this.isInitialized) return;
    console.log('play ground music triggered..')
    try {
      const music = this.sounds.get('backgroundMusic');
      if (music) {
        music.volume = this.volume * 0.9;
        music.loop = true;
        
        const playPromise = music.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        console.log('Real background music started');
      } else {
        console.log('No background music available, using silent fallback');
      }
    } catch (error) {
      console.warn('Background music playback failed:', error);
    }
  }

  // GENERATED TONES (all other sounds use Web Audio API)
  async diceRoll() {
    // Generated tone - no real file
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const freq = 400 + Math.random() * 200;
        const dur = 0.12 + Math.random() * 0.06;
        this.generateTone(freq, dur, 'triangle', 0.6 + Math.random() * 0.3);
      }, i * 50);
    }
    
    setTimeout(() => {
      this.generateTone(250, 0.15, 'sine', 0.8);
      setTimeout(() => {
        this.generateTone(180, 0.2, 'sine', 0.6);
      }, 80);
    }, 450);
  }

  async diceClick() {
    // Generated tone - no real file
    this.generateTone(1000, 0.08, 'sine', 0.5);
    setTimeout(() => {
      this.generateTone(750, 0.1, 'sine', 0.3);
    }, 60);
  }

  async pieceMove() {
    // Generated tone - no real file
    this.generateTone(350, 0.25, 'sine', 0.6);
  }

  async snakeHit() {
    // Generated tone - no real file
    this.generateTone(600, 0.2, 'sine', 0.8);
    setTimeout(() => {
      this.generateTone(400, 0.3, 'sine', 0.7);
    }, 120);
    setTimeout(() => {
      this.generateTone(300, 0.25, 'sine', 0.5);
    }, 250);
    setTimeout(() => {
      this.generateTone(200, 0.2, 'triangle', 0.4);
    }, 450);
  }

  async ladderClimb() {
    // Generated tone - no real file
    const notes = [330, 415, 494, 587, 659];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTone(freq, 0.22, 'sine', 0.7 - (index * 0.08));
      }, index * 140);
    });
    
    setTimeout(() => {
      this.generateTone(880, 0.25, 'sine', 0.8);
      setTimeout(() => {
        this.generateTone(1100, 0.2, 'sine', 0.6);
      }, 150);
    }, 750);
  }

  async gameWin() {
    // Generated tone - no real file
    const victoryNotes = [
      { freq: 440, dur: 0.25 },
      { freq: 554, dur: 0.25 },
      { freq: 659, dur: 0.25 },
      { freq: 880, dur: 0.5 },
      { freq: 880, dur: 0.4 },
      { freq: 1047, dur: 0.6 }
    ];
    
    victoryNotes.forEach((note, index) => {
      setTimeout(() => {
        this.generateTone(note.freq, note.dur, 'sine', 0.8);
      }, index * 220);
    });
    
    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const freq = 800 + Math.random() * 600;
          this.generateTone(freq, 0.15, 'sine', 0.5);
        }, i * 100);
      }
    }, 1300);
  }

  async turnStart() {
    // Generated tone - no real file
    this.generateTone(660, 0.2, 'sine', 0.6);
    setTimeout(() => {
      this.generateTone(880, 0.2, 'sine', 0.5);
    }, 150);
  }

  async buttonHover() {
    // Generated tone - no real file
    this.generateTone(1100, 0.08, 'sine', 0.3);
  }

  // Control methods
  stopBackgroundMusic() {
    const music = this.sounds.get('backgroundMusic');
    if (music) {
      music.pause();
      music.currentTime = 0;
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    this.sounds.forEach(sound => {
      try {
        sound.volume = this.volume;
      } catch (error) {
        console.warn('Failed to update sound volume:', error);
      }
    });
  }

  toggleMute() {
    console.info(this.muted,'mute current status')
    this.muted = !this.muted;
    
    if (this.muted) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    
    return this.muted;
  }

  getVolume() {
    return this.volume;
  }

  isMuted() {
    return this.muted;
  }

  destroy() {
    this.stopBackgroundMusic();
    this.sounds.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Create singleton instance
const soundService = new SoundService();

export { SoundService };
export default soundService;