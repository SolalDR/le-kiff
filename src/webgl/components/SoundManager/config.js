export default {

  globalVolume: 0.5,
  // Full list here : https://github.com/Theodeus/tuna/wiki
  effects: [
    {
      name: 'MoogFilter',
      params: {
        cutoff: 0.1,    //0 to 1
        resonance: 3,   //0 to 4
        bufferSize: 4096,  //256 to 16384,
        intensity: {
          value: 1,
          param: {
            name: 'cutoff',
            min: 1,
            max: 0.1
          }
        }
      }
    },
    {
      name: 'Convolver',
      params: {
        highCut: 22050,                         //20 to 22050
        lowCut: 40,                             //20 to 22050
        dryLevel: 0.1,                            //0 to 1+
        wetLevel: 1,                            //0 to 1+
        level: 1,
        impulse: "/sounds/impulses/spring.wav",    //the path to your impulse response,
        intensity: {
          value: 1,
          param: {
            name: 'lowCut',
            min: 22050,
            max: 40
          }
        }
      }
    },
    {
      name: 'Overdrive',
      params: {
        outputGain: 0.2,         //0 to 1+
        drive: 0.4,              //0 to 1
        curveAmount: 0.6,          //0 to 1
        algorithmIndex: 2,       //0 to 5, selects one of our drive algorithms
        intensity: {
          value: 1,
          param: {
            name: 'drive',
            min: 0,
            max: 0.4
          }
        }
      }
    }
  ]
}
