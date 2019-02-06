import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";
import particleConfig from "~/webgl/components/ParticleCloud/config"

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
    name : 'step_1_human_leaf',
    options: {
      timeScale: 0.0009
    },
    clips: [
      {
        name: 'cut',
        firstFrame: 213,
        lastFrame: 264,
      }
    ]
  },
  sounds: [
    {
      name : "chapter_1_main_voice",
      sprite: {
        step_3: [
          39000,
          28000
        ],
      },
      options : {
        volume: 0.9
      } 
    },
    {
      name : "step_1_background_sound"
    }
  ],

  micro: {
    colorPlane: colorPlane.extends({
      color: new THREE.Color("rgb(248,155,47)")
    }),
    molecules: {
      acide_sulfurique: {
        position: new THREE.Vector3(4, 1, 1)
      },
      kerosene: {
        position: new THREE.Vector3(-2, 0, 0),
        scale: new THREE.Vector3(0.8, 0.8, 0.8)
      },
    }
  },

  particleConfig: particleConfig.extends({
    color: new THREE.Color("rgb(107,94,72)"),
    count: 3000,
    spread: 0.2,
    amplitude: new THREE.Vector3(40, 10, 34),
    noise_amplitude: new THREE.Vector3(40, -25, 20),
    speed: 0.00005,
    size: 0,
    position: new THREE.Vector3(0, -15, 0)
  })

})
