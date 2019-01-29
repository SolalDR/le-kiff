import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  modelAnimation: {
    name : 'coca-plant',
    options: {
      timeScale: 0.0009
    },
    clips: [
      {
        name: 'hang-out',
        firstFrame: 0,
        lastFrame: 70,
      },
      {
        name: 'move-in-wind',
        firstFrame: 70,
        lastFrame: 171,
      },
      {
        name: 'idle',
        firstFrame: 171,
        lastFrame: 213,
        loop: THREE.LoopRepeat,
      }
    ]
  }, 
  sounds: [
    {
      name : "step_2_main_sound", 
      options : {
        volume: 0.9
      }
    },
    {
      name : "step_1_background_sound"
    }
  ]
})
