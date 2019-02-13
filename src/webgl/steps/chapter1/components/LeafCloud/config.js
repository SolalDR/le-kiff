import { c } from "../../../../../helpers/Configuration";

export default c({
  // When Leaf cloud is hide
  hidden: {
    position: new THREE.Vector3(-50, 20, -50),
    scale: new THREE.Vector3(3.5, 3.5, 3.5),
    speedRotation: 5. * 0.0001,
    speedPosition: 0.2 * 0.0001,
    amplitude: 10
  }, 

  // When Leaf cloud is floating in the air (Step2)
  air: {
    position: new THREE.Vector3(0, 0, -75),
    scale: new THREE.Vector3(3.5, 3.5, 3.5),
    speedRotation: 2. * 0.0001,
    speedPosition: 0.2 * 0.0001,
    amplitude: 30
  }, 

  // When Leaf cloud is floating in water (Step3)
  water: {
    position: new THREE.Vector3(0, -10, 0),
    scale: new THREE.Vector3(1, 1, 1),
    speedRotation: 2. * 0.0001,
    speedPosition: 0.2 * 0.0001,
    amplitude: 10
  }
})
