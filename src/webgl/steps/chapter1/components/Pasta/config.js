import { c } from "../../../../../helpers/Configuration";

export default c({
  noiseIntensity: 2,
  position: new THREE.Vector3(0, 0, 0),
  scale: new THREE.Vector3(0.7, 0.7, 0.7),
  rocks: {
    noiseIntensity: 10
  },
  modelAnimation: {
    name : 'step_4_pasta',
    options: {
      timeScale: 0.0009
    },
    clips: [
      {
        name: 'merge',
        firstFrame: 0,
        lastFrame: 23
      },
      {
        name: 'explode',
        firstFrame: 25,
        lastFrame: 40
      }
    ]
  }
})
