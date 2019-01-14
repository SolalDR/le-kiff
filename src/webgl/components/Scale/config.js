import { c } from "../../../helpers/Configuration";

var transitionConfig = c({
  duration: 1000,
  position: {
    from: new THREE.Vector3(0, 0, 50),
    to: new THREE.Vector3(0, 0, 8)
  },

  target: {
    from: new THREE.Vector3(0, 0, 0),
    to: new THREE.Vector3(0, 0, 0)
  },
  
  postprocess: {
    duration: 1000,
    bloom: {
      strength: {
        from: 10,
        to: 0.1
      }
    }
  }
});

export default c({
  background: new THREE.Color(0xf2f3ee),
  camera: {
    position: new THREE.Vector3(0, 0, 8),
  },
  transitions: {
    micro: transitionConfig.clone(),
    macro: transitionConfig.clone(),
    human: transitionConfig.clone(),
    all: transitionConfig.clone()
  }
});
