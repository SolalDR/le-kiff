import {Howler} from 'howler'
import SoundEffectManager from './SoundEffectManager'
import config from './config'

class SoundManager {

  /**
   * @constructor
   * @property {Map} sounds
   * @property {float} volume
   * @property {Howler} howler
   * @property {SoundEffectManager} soundEffectManager 
   */
  constructor(){
    this.sounds = new Map();
    this._volume = 0;
    this.defaultVolume = 0;
    this.howler = null;
    this.soundEffectManager = null;

    // init on dom content loaded to get audio context
    document.addEventListener("DOMContentLoaded", this.init.bind(this));
  }
  
  /**
   * init sound effect
   */
  init() {
    this.howler = Howler;
    this.soundEffectManager = new SoundEffectManager();
    this.volume = this.defaultVolume = config.globalVolume;
  }

  get volume() {
    return this._volume;
  }

  set volume(v) {
    Howler.volume(v);
    this._volume = v
  }

  /**
   * 
   * @param {String[]|String} soundNames Array or String of sound names
   */
  play(soundNames) {
    const play = (name) => {
      const sound = this.getSound(name);
      if(sound.playing()) return;
      sound.volume(sound.defaultVolume);
      sound.play();
    }
    if(Array.isArray( soundNames )) {
      soundNames.forEach(name => {
        play(name);
      })
    } else {
      play(soundNames);
    }
  }
  
  /**
   * Play all sounds from sounds[]
   */
  playAll() {
    this.sounds.forEach((sound) => {
      if(!sound.playing()) {
        this.play(sound);
      }
    });
  }

  /**
   * 
   * @param {String[]|String} soundNames Array or String of sound names
   * @param {Boolean} fade  Stop with fade
   */
  stop(soundNames, fade) { 
    const stop = (name) => {
      const sound = this.getSound(name);
      if(!sound) console.error('sound', name, 'not found');
      if(fade) {
        this.fade(sound, 'out');
        sound.once('fade', sound.stop)
      } else {
        sound.stop();
      }
    }
    if( Array.isArray( soundNames )) {
      soundNames.forEach(name => {
        stop(name);
      })
    } else {
      stop(soundNames);
    }
  }

  /**
   * stop all sounds
   */
  stopAll() {
    this.sounds.forEach((sound) => {
      this.stop(sound);
    });
  }

  /**
   *
   * @param {Howler} sound Sound object to fade 
   * @param {Number} from Volume to fade from
   * @param {Number} to Volume to fade to
   * @param {Number} duration Fade duration
   * @param {String|Number} id sprite or sound id  
   */
  fade(sound, type, duration = 1000, id = null) {
    var from,to;
    if(type === 'in') {
      from = 0;
      to = sound.volume();
    } else if(type === 'out') {
      from = sound.volume();
      to = 0;
    } else {
      console.error('define fade type "in" or "out"');
    }    
    if(id) {
      sound.fade(from, to, duration, id)
    } else {
      sound.fade(from, to, duration)
    }
  }

  /**
   * Get a sound from this.sounds[] by its name
   * @param {String} name 
   */
  getSound(name) {
    const sound = this.sounds.get(name);
    if(sound) {
      return this.sounds.get(name);
    } else {
      console.error('sound', name, 'not found');
      return null;
    }
  }

  updatePlayBack(soundsData) {
    // add new sounds
    this.add(soundsData);

    // stop sounds not in sounds data
    this.sounds.forEach((sound, name) => {
      if(sound.playing()) {
        if( !soundsData.find(soundData => soundData.name === name) ) {
          this.stop(name, true);
        }
      }
    });

    // play added sounds
    this.play(soundsData.map(data => data.name))
  }

  /**
   * Add
   * @param {Object[]|Objet} soundsData Can be Object Array or Object of sound datas 
   * @param {string} soundsData.name Sound name
   * @param {Howl} soundsData.sound Howler sound entity
   * @param {Object} soundsData.options Howler sound options
   */
 add(soundsData){
   const add = (data) => {
    const soundObject = this.assignOptions(data.sound, data.options);
    this.sounds.set(data.name, soundObject);
   }
   if( Array.isArray( soundsData )) {
    soundsData.forEach((data) => {
      if( !this.sounds.get(data.name) ) {
        add(data);
      }
    });
   } else {
      add(soundsData);
   }
 }

  /**
   * Remove a sound by is name
   * @param {string} name sound name 
   */
  removeSound(name){
    var sound = this.getSound(name);
    this.fade(sound, 'out');
    sound.once('fade', () => {
      sound.stop();
      this.sounds.delete( name );
    });
  }

  /**
   * Update sounds
   * @param {*} sounds 
   */
  updateSounds(soundsData){
    // add sounds
    this.add(soundsData);

    // remove sounds 
    this.sounds.forEach((sound, name) => {
      if( !soundsData.find(elementTmp => elementTmp.name === name) ) {
        this.removeSound(name);
      }
    });
  }

  /**
   * Assign options to Howl Object
   * @param {Howl} sound Howl object
   * @param {Object} options
   * @return {Howl}
   */
  assignOptions(sound, options = null) {
    Object.entries(options).forEach(([key, value]) => {
      sound['_' + key] = value;
    });
    sound.defaultVolume = options.volume || 1;
    return sound;
  }

  // Effects
  // ======================================

  /**
   * @param {String} name effect name
   */
  addEffect(name) {
    this.soundEffectManager.addEffect(name);
  }

  /**
   * @param {String} name effect name 
   */
  removeEffect(name) {
    this.soundEffectManager.removeEffect(name);
  }

  removeAllEffects() {
    this.soundEffectManager.removeAllEffects(); 
  }

  /**
   * Set effect intensity 
   * @param {String} name effect name
   * @param {Number} advancement value between 0 and 1
   */
  setEffectIntensity(name, advancement) {
    this.soundEffectManager.effects[name].setIntensity(advancement);
  }

}

export default new SoundManager();
