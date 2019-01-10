import {Howler} from 'howler'
import SoundEffectManager from './SoundEffectManager'
import config from './config'

class SoundManager {

  /**
   * @constructor
   * @property {Howler} howler
   * @property {Map} sounds
   * @property {float} volume
   * @property {SoundEffectManager} soundEffectManager 
   */
  constructor(){
    this.sounds = new Map();
    this._volume = 0.5;
    this.howler = null;
    this.soundEffectManager = null;
  }
  
  init() {
    this.howler = Howler;
    this.soundEffectManager = new SoundEffectManager();
    this.volume = config.globalVolume;
  }

  get volume() {
    return this._volume;
  }

  set volume(v) {
    Howler.volume(v);
    this._volume = v
  }

  // Add mute

  /**
   * 
   * @param {Howl} sound 
   * @param {String|Number} id sprite or sound id
   */
  play(sound, id = null) {
    if(id) {
      sound.play(id);  
    } else {
      sound.play();  
    }
  }

  playAll() {
    this.sounds.forEach((sound) => {
      if(!sound.playing()) {
        this.play(sound);
      }
    });
  }

  /**
   * 
   * @param {Howl} sound 
   * @param {String|Number} id sprite or sound id
   */
  stop(sound, id = null) {
      if(id) {
        sound.stop(id);  
      } else {
        sound.stop();  
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
    console.log(sound);
    if(type === 'in') {
      var from = 0;
      var to = sound.volume();
    } else if(type === 'out') {
      var from = sound.volume();
      var to = 0;
    } else {
      console.error('define fade type "in" or "out"');
    }

    console.log(from, to);    
    if(id) {
      sound.fade(from, to, duration, id)
    } else {
      console.log(sound);
      sound.fade(from, to, duration)
    }
  }

  /**
   * add single sound to manager
   * @param {string} name sound name
   * @param {Howl} sound howler sound object
   * @param {Object} options sound options object
   */
  addSound(name, sound, options){
    const soundObject = this.assignOptions(sound, options);
    soundObject.load();
    this.sounds.set(name, soundObject);
  }

  /**
   * Remove a sound by is name
   * @param {string} name sound name 
   */
  removeSound(name){
    var sound = this.sounds.get(name);
    console.log(sound, name);
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
    soundsData.forEach((element) => {
      if( !this.sounds.get(element.name) ) {
        this.addSound(element.name, element.sound, element.options);
      }
    });

    // remove sounds 
    this.sounds.forEach((sound, name) => {
      if( !soundsData.find(elementTmp => elementTmp.name === name) ) {
        this.removeSound(name);
      }
    });
  }

  /**
   * add multiple sounds to manager
   * @param {Array.{name: String, sound: Howl, options: Object}} soundArray array of objects sound datas 
   * @param {Howl} sound howler sound object
   * @return {Object} options sound options object
   */
  addMultipleSounds(soundArray) {
    soundArray.forEach(element => {
      this.addSound(element.name, element.sound, element.options)
    });
  }

  assignOptions(sound, options) {
    Object.entries(options).forEach(([key, value]) => {
      // we shouldn't do that but no other way to assign options after instanciation
      sound['_' + key] = value;
    });
    return sound;
  }

  // Effects
  // ======================================

  addEffect(name) {
    this.soundEffectManager.addEffect(name);
  }

  removeEffects() {
    this.soundEffectManager.removeAllEffects(); 
  }

  setEffectIntensity(name, advancement) {
    this.soundEffectManager.effects[name].setIntensity(advancement);
  }

}

export default new SoundManager();
