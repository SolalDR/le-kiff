import baseConfig from "./../../config";
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

  particleConfig: particleConfig.extends({
    color: new THREE.Color("rgb(53,29,0)"),
    count: 30000,
    spread: 1,
    amplitude: new THREE.Vector3(20, 20, 40),
    noise_amplitude: new THREE.Vector3(30),
    speed: 0.00015,
    size: 3,
    position: new THREE.Vector3(0, 0, -10)
  })

})
