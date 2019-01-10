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
    */
  constructor(){
    this.tuna = new Tuna(Howler.ctx);
    this.effects = {}
    this.activeEffects = new Map();

    this.createEffects();
  }
  
  addEffect(name) {
    Howler.addEffect(this.effects[name].effect);
    this.activeEffects.set(name, this.effects[name]);
  }

  /**
   * 
   * @param {Array(String)} list 
   */
  addMultipleEffects(list) {
    list.forEach(name => {
      this.addEffect(name);
    })
  }

  removeEffect(name) {
    Howler.removeEffect(this.effects[name].effect);
    this.activeEffects.delete(name);
  }

  removeAllEffects() {
    this.activeEffects.forEach((effect, key) => {
      this.removeEffect(key)
    });
  }

  switchEffect(name) {
      this.removeAllEffects();
      this.addEffect(name);
  }

  makeEffect(name, params) {
    var lowerCaseName = name.toLowerCase();
    this.effects[lowerCaseName] = new SoundEffectEntity({
      name: name,
      params: params,
      tuna: this.tuna
    })
  }

  /**
   * Create sound effects
   * 
   */
  createEffects() {
    config.effects.forEach(effect => {
      console.log(effect.name, effect.params);
      this.makeEffect(effect.name, effect.params);
    })
  }

}

export default SoundEffectManager;
