import {Howler} from 'howler'
import Tuna from 'tunajs'
import 'howler-plugin-effect-chain'
import SoundEffectEntity from './SoundEffectEntity'
import config from './config';

/**
 * SoundEffectManager with tuna and linked to Howler
 * 
 */
class SoundEffectManager {
   /**
    * @constructor
    * @property {Tuna} Tuna Tuna instance
    * @property {Object} effects
    * @property {float} volume
    * @property {SoundEffectManager} soundEffectManager 
    */    
  constructor(){
    this.tuna = new Tuna(Howler.ctx);
    this.effects = {}
    this.activeEffects = new Map();

    this.createEffects();
  }
  
  /**
   * Add effect to playing audio
   * @param {String} name Effect name
   */
  addEffect(name) {
    Howler.addEffect(this.effects[name].effect);
    this.activeEffects.set(name, this.effects[name]);
  }

  /**
   * Remove effect from playing audio
   * @param {String} name 
   */
  removeEffect(name) {
    Howler.removeEffect(this.effects[name].effect);
    this.activeEffects.delete(name);
  }

  /**
   * Remove all active effects
   */
  removeAllEffects() {
    this.activeEffects.forEach((effect, key) => {
      this.removeEffect(key)
    });
  }

  /**
   * Switch from active effect to selected effect
   * @param {String} name effect name
   */
  switchEffect(name) {
      this.removeAllEffects();
      this.addEffect(name);
  }

  /**
   * Create a new effect from Tuna and add it to effects Array
   * @param {Name} name Effect name
   * @param {Object} params Effect params
   */
  makeEffect(name, params) {
    var lowerCaseName = name.toLowerCase();
    this.effects[lowerCaseName] = new SoundEffectEntity({
      name: name,
      params: params,
      tuna: this.tuna
    })
  }

  /**
   * Create all sound effects from config
   */
  createEffects() {
    config.effects.forEach(effect => {
      this.makeEffect(effect.name, effect.params);
    })
  }

}

export default SoundEffectManager;
