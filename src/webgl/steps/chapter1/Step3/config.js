import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";

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
  }
})
