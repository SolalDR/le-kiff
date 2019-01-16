export default {

  globalVolume: 0.5,
  // Full list here : https://github.com/Theodeus/tuna/wiki
  effects: [
    {
      name: 'MoogFilter',
      params: {
        cutoff: 0.15,    //0 to 1
        resonance: 3.2,   //0 to 4
        bufferSize: 4096,  //256 to 16384,
        intensity: {
          value: 1,
          param: {
            name: 'cutoff',
            min: 1,
            max: 0.15
          }
        }
      }
    },
    {
      name: 'Convolver',
      params: {
        highCut: 6000,                         //20 to 22050
        lowCut: 20,                             //20 to 22050
        dryLevel: 0.5,                            //0 to 1+
        wetLevel: 1,                            //0 to 1+
        level: 0.8,
        impulse: "/sounds/impulses/ablcr_reverb_echo.wav",    //the path to your impulse response,
        intensity: {
          value: 1,
          param: {
            name: 'lowCut',
            min: 22050,
            max: 500
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
