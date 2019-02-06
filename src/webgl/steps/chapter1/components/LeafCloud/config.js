import { c } from "../../../../../helpers/Configuration";

export default c({
  // When Leaf cloud is hide
  hidden: {
    position: new THREE.Vector3(-10, -11, -15),
    speedRotation: 5.,
    speedPosition: 0.2,
    amplitude: 10
  }, 

  // When Leaf cloud is floating in the air (Step2)
  air: {
    position: new THREE.Vector3(0, 0, 0),
    speedRotation: 2.,
    speedPosition: 0.2,
    amplitude: 30
  }, 

  // When Leaf cloud is floating in water (Step3)
  water: {
    position: new THREE.Vector3(0, -10, 0),
    speedRotation: 2.,
    speedPosition: 0.2,
    amplitude: 10
  }
})
