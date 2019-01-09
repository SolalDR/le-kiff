import {Howl, Howler} from 'howler'
import SoundEffectManager from './SoundEffectManager'

class SoundManager {

  /**
   * @constructor
   * @property {Map} sounds
   * @property {float} volume
   * @property {SoundEffectManager} soundEffectManager 
   */
  constructor(){
    this.sounds = new Map();
    this._volume = 0.5;
    this.soundEffectManager = new SoundEffectManager(Howler.ctx)
  }

  get volume() {
    return this._volume;
  }

  set volume(v) {
    Howler.volume(v);
    this._volume = v
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

  play(sound) {
    this.sounds[sound].play();
  }

  playAll() {
    this.sounds.forEach(function(sound, key) {
      sound.play();
    });
  }

  applyEffect(name) {
    this.soundEffectManager.applyEffect(name);
  }

  assignOptions(sound, options) {
    Object.entries(options).forEach(([key, value]) => {
      sound[key] = value;
    })
    return sound;
  }
}

export default SoundManager;
