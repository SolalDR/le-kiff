import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  human: {
    rendering: {
      light: {
        primary: {
          position: new THREE.Vector3(5, 15, 5)
        }
      }
    }
  },
  modelAnimation: {
    name : 'step_4_pasta',
    options: {
      timeScale:0.0009
    },
    clips: [
      {
        name: 'main',
        firstFrame: 0,
        lastFrame: 28,
        loop: THREE.LoopPingPong
      }
    ]
  },
  sounds: [
    {
      name : "chapter_1_main_voice",
      sprite: {
        step_4: [
          67000,
          14000
        ],
      },
      options : {
        volume: 0.9
      } 
    }
  ]
})
