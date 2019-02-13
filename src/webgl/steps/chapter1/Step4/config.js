import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";
import particleConfig from "~/webgl/components/ParticleCloud/config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  human: {
    rendering: {
      bokeh: {
        focus: -1
      },
      light: {
        primary: {
          position: new THREE.Vector3(5, 15, 5)
        }
      }
    }
  },
  micro: {
    bondMaterial: {
      color: new THREE.Color("rgb(138, 81, 0)"),
      emissive: new THREE.Color("rgb(115, 82, 52)"),
    },
    colorPlane: colorPlane.extends({
      color: new THREE.Color("rgb(162, 102, 31)")
    }),
    molecules: {
      cocaine: {
        position: new THREE.Vector3(-2.8, -1, 0),
        scale: new THREE.Vector3(0.8, 0.8, 0.8)
      },
      ammoniac: {
        position: new THREE.Vector3(1.7,1, 0),
        scale: new THREE.Vector3(1.4, 1.4, 1.4)
      }
    },
    particleConfig: particleConfig.extends({
      color: new THREE.Color("rgb(244, 198, 80)")
    }),
    rendering: {
      toneMappingExposure: 0.7,
      toneMappingWhitePoint: 1,
      light: {
        primary: {
          intensity: 0.4,
          decay: 1,
          power: 25,
          color: new THREE.Color("rgb(255,105,0)")
        },
        secondary: {
          intensity: 1.9,
          decay: 1,
          power: 13,
          color: new THREE.Color("rgb(243,66,12)")
        }
      }
    }
  },
  
  sounds: [
    {
      name : "chapter_1_ambiance",
      spriteName: 'step_4',
      options: {
        volume: 0.3
      }
    }
  ],

  // TODO extend config water
  water: {
    color: new THREE.Color("rgb(100, 85, 14)"),
    position: new THREE.Vector3(0, -2, 7),
    scale: new THREE.Vector3(2, 1, 1)
  }
})
