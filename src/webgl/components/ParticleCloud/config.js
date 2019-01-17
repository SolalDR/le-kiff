import {c} from "~/helpers/Configuration";

export default c({
  color: new THREE.Color("rgb(114, 248, 145)"),
  count: 30000,
  spread: 1,
  amplitude: new THREE.Vector3(400, 300, 100),
  noise_amplitude: new THREE.Vector3(80, 80, 80),
  speed: 0.00015,
  size: 3,
  position: new THREE.Vector3(0, 0, -100)
});
