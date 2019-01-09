import {Howler} from 'howler'
import SoundEffectManager from './SoundEffectManager'

class SoundManager {

  /**
   * @constructor
   * @property {Map} sounds
   * @property {float} volume
   * @property {SoundEffectManager} soundEffectManager 
   */
  constructor(){
    this.howler = Howler;
    this.sounds = new Map();
    this._volume = 0.5;
    this.soundEffectManager = new SoundEffectManager(this.howler.ctx)
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
   * @param {Howl} sound 
   * @param {String|Number} id sprite or sound id
   */
  play(sound, id = null) {
    this.sounds[sound].play(id);
  }

  playAll() {
    this.sounds.forEach(function(sound, key) {
      sound.play();
    });
  }

  applyEffect(name) {
    this.soundEffectManager.applyEffect(name);
  }

  /**
   * Update sounds
   * @param {*} sounds 
   */
  updateSounds(sounds){
    // add sounds
    sounds.forEach((element) => {
      if( !this.sounds.get(element.name) ) {
        this.addSound(element.name, element.sound, element.options);
      }
    });

    // remove sounds 
    this.sounds.forEach(element => {
      if( !sounds.find(elementTmp => elementTmp.name === element.name) ) {
        this.removeSound(element.name);
      }
    });

  }

  /**
   * add single sound to manager
   * @param {string} name sound name
   * @param {Howl} sound howler sound object
   * @param {Object} options sound options object
   */
  addSound(name, sound, options){
    const soundObject = this.assignOptions(sound, options);
    this.sounds.set(name, soundObject);
  }

  /**
   * Remove a sound by is name
   * @param {string} name sound name 
   */
  removeSound(name){
    this.sounds.delete( name );
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
      sound[key] = value;
    })
    return sound;
  }
}

export default SoundManager;
