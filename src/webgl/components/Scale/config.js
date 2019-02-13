import renderingConfig from "./../../rendering/config";

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
      strength: { // Animated
        from: 10,
        to: 0
      },
      radius: {
        from: 0,
        to: 0
      },
      threshold: {
        from: 0,
        to: 0
      }
    }
  }
});

export default c({
  camera: {
    position: new THREE.Vector3(0, 0, 8),
  },

  rendering: renderingConfig,

  transitions: {
    micro: transitionConfig.clone(),
    macro: transitionConfig.clone(),
    human: transitionConfig.clone(),
    all: transitionConfig.clone()
  }
});
