import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";
import particleConfig from "~/webgl/components/ParticleCloud/config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  human: {
    camera: {
      radius: 8,
      duration: 3000,
      delay: 10000
    },

    rendering: {
      light: {
        primary: {
          intensity: 1
        },
        secondary: {
          intensity: 0.5
        },
        ambient: {
          intensity: 1.5
        }
      }
    },

    air: {
      focus: 0,
    },

    water: {
      focus: -0.2,
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
        firstFrame: 284,
        lastFrame: 313,
      }
    ]
  },
  sounds: [
    {
      name : 'chapter_1_main_voice',
      spriteName: 'step_3'
    },
    {
      name : "chapter_1_ambiance",
      spriteName: 'step_3'
    },
    {
      name : 'chapter_1_trigger',
      spriteName: 'step_3_01_h1_allez_c_est_parti'
    },
  ],
  timecodes: {
    cut: 11000,
    water: 11400,
  },
  micro: {
    bondMaterial: {
      color: new THREE.Color("rgb(0, 0, 0)"),
      emissive: new THREE.Color("rgb(196, 245, 36)"),
    },
    colorPlane: colorPlane.extends({
      color: new THREE.Color("rgb(81, 111, 23)")
    }),
    molecules: {
      cocaine: {
        position: new THREE.Vector3(-2, 3, -8),
        scale: new THREE.Vector3(0.8, 0.8, 0.8)
      },
      acide_sulfurique: {
        position: new THREE.Vector3(3, 0, 1),
        scale: new THREE.Vector3(0.9, 0.9, 0.9)
      },
      kerosene: {
        position: new THREE.Vector3(-1.5, -1.6, 1),
        scale: new THREE.Vector3(0.8, 0.8, 0.8),
      },
    },
    particleConfig: particleConfig.extends({
      color: new THREE.Color("rgb(248,248,114)")
    }),
    rendering: {
      toneMappingExposure: 0.7,
      toneMappingWhitePoint: 1,
      light: {
        primary: {
          intensity: 0.4,
          decay: 1,
          power: 25,
          color: new THREE.Color("rgb(243,229,21)")
        },
        secondary: {
          intensity: 0.2,
          decay: 1,
          power: 25,
          color: new THREE.Color("rgb(243,255,0)")
        }
      }
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
  }),

})
