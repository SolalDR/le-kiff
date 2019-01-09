import {Howler} from 'howler'
import Tuna from 'tunajs'
import 'howler-plugin-effect-chain'


class SoundEffectManager {

  /**
   * @constructor
   * @property {SoundEffectManager} soundEffectManager 
   */
  constructor(context){
    this.context = context;
    //console.log(Howler);
    this.tuna = new Tuna(Howler.ctx);
    this.output = this.context.createGain();
    this.effects = {}

    this.createEffects();
  }

  createEffects() {
    // chorus
    this.effects.chorus = new this.tuna.Chorus({
      rate: 1.5,         //0.01 to 8+
      feedback: 0.2,     //0 to 1+
      delay: 0.0045,     //0 to 1
      bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
    });

    // moog
    this.effects.moog = new this.tuna.MoogFilter({
      cutoff: 0.07,    //0 to 1
      resonance: 3.4,   //0 to 4
      bufferSize: 8192  //256 to 16384
    });

    this.effects.convolver = new this.tuna.Convolver({
      highCut: 20,                         //20 to 22050
      lowCut: 20,                             //20 to 22050
      dryLevel: 0.5,                            //0 to 1+
      wetLevel: 1,                            //0 to 1+
      level: 1,                               //0 to 1+, adjusts total output of both wet and dry
      impulse: "/sounds/impulses/deep-ambience.wav",    //the path to your impulse response 
      bypass: 0
    });
  }

  applyEffect(name) {
    //this.effects[name].connect(this.output);
    Howler.addEffect(this.effects[name])

  }
}

export default SoundEffectManager;
