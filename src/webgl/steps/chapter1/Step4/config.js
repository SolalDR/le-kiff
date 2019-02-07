import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";
import particleConfig from "~/webgl/components/ParticleCloud/config";

export default baseConfig.extends({
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
  }
})
