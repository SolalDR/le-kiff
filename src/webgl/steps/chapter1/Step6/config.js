import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";
import particleConfig from "~/webgl/components/ParticleCloud/config";

export default baseConfig.extends({
  micro: {
    bondMaterial: {
      color: new THREE.Color("rgb(0, 0, 0)"),
      emissive: new THREE.Color("rgb(79, 100, 115)")
    },
    colorPlane: colorPlane.extends({
      color: new THREE.Color("rgb(44, 48, 55)")
    }),
    molecules: {
      cocaine: {
        position: new THREE.Vector3(-2.8, -0.5, -0.5),
        scale: new THREE.Vector3(0.8, 0.8, 0.8)
      },
      acide_sulfurique: {
        position: new THREE.Vector3(2, 1, 1),
        scale: new THREE.Vector3(1.1, 1.1, 1.1)
      }
    },
    particleConfig: particleConfig.extends({
      color: new THREE.Color("rgb(255, 253, 253)")
    }),
    rendering: {
      toneMappingExposure: 0.7,
      toneMappingWhitePoint: 1,
      light: {
        primary: {
          intensity: 0.4,
          decay: 1,
          power: 25,
          color: new THREE.Color("rgb(56, 56, 70)")
        },
        secondary: {
          intensity: 1,
          decay: 1,
          power: 13,
          color: new THREE.Color("rgb(151,171,220)")
        }
      }
    }
  },
  human: {
    rendering: {
      light: {
        primary: {
          intensity: 0.9,
          color: new THREE.Color("rgb(255, 253, 238)"),
          position: new THREE.Vector3(15, 15, 20)
        },
        secondary: {
          intensity: 0.8,
          color: new THREE.Color("rgb(255, 255, 255)"),
          position: new THREE.Vector3(-3, 0, 1)
        }
      }
    }
  },
  sounds: [
    {
      name : "chapter_1_ambiance",
      spriteName: 'step_6',
      options: {
        volume: 0.3
      }
    },
    {
      name : "chapter_1_main_voice",
      spriteName: 'step_6'
    },
  ],
  timecodes: {
    press: 6000,
    microWave: 9000
  }
})
