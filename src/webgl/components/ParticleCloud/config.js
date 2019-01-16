import {c} from "~/helpers/Configuration";

export default c({
  color: new THREE.Color("rgb(84,117,44)"),
  count: 30000,
  spread: 1,
  amplitude: new THREE.Vector3(400, 300, 100),
  noise_amplitude: new THREE.Vector3(10, 10, 10),
  speed: 0.0005,
  size: 1,
  position: new THREE.Vector3(0, 0, -100)
});
