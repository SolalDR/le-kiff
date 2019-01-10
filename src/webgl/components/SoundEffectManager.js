import {Howler} from 'howler'
import Tuna from 'tunajs'
import 'howler-plugin-effect-chain'

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
   * list here : https://github.com/Theodeus/tuna/wiki
   * 
   */
  createEffects() {


    // MoogFilter
    this.makeEffect('MoogFilter', {
      cutoff: 0.07,    //0 to 1
      resonance: 3.2,   //0 to 4
      bufferSize: 8192,  //256 to 16384,
      intensity: {
        value: 1,
        paramName: 'cutoff',
        min: 1,
        max: 0.07
      }
    });

    // Convolver
    this.makeEffect('Convolver', {
      highCut: 22050,                         //20 to 22050
      lowCut: 40,                             //20 to 22050
      dryLevel: 0.1,                            //0 to 1+
      wetLevel: 1,                            //0 to 1+
      level: 1,
      impulse: "/sounds/impulses/spring.wav",    //the path to your impulse response,
      intensity: {
        value: 1,
        paramName: 'lowCut',
        min: 22050,
        max: 40
      }
    });

    // Overdrive
    this.makeEffect('Overdrive', {
      outputGain: 0.2,         //0 to 1+
      drive: 0.4,              //0 to 1
      curveAmount: 0.6,          //0 to 1
      algorithmIndex: 2,       //0 to 5, selects one of our drive algorithms
      intensity: {
        value: 1,
        paramName: 'drive',
        min: 0,
        max: 0.4
      }
    });

  }

}

export default SoundEffectManager;

class SoundEffectEntity {
  constructor({
    tuna,
    name,
    params
  } = {}) {
    this.name = name;
    this.tuna = tuna;
    this.effect = new this.tuna[name](params);
    this.intensity = params.intensity;

    this.setIntensity(this.intensity.value);
  }

  setIntensity(value) {
    this.intensity.value = value;
    var min = this.intensity.min;
    var max = this.intensity.max;
    var isObject = typeof this.effect[this.intensity.paramName] === 'object';
    var result = min + (max - min) * this.intensity.value;
    if(isObject) {
      this.effect[this.intensity.paramName].value = result;
    } else {
      this.effect[this.intensity.paramName] = result;
    }
  }

}
