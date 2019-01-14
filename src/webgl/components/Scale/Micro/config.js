import { c } from "../../../../helpers/Configuration";
import baseConfig from "./../config";

export default baseConfig.extends({  
  camera: {
    position: new THREE.Vector3(0, 0, 8),
  },
  
  transitions: {
    all: {
      position: {
        from: new THREE.Vector3(0, 0, 50),
        to: new THREE.Vector3(0, 0, 10)
      },
      soundEffect: {
        duration: 1000,
        effects : ['moogfilter']
      }
    }
  },

  molecules: {
    cocaine: {
      offset: new THREE.Vector3(-30, -8, 20),
      position: new THREE.Vector3(1, 0, -3),
      rotation: new THREE.Euler(0, -1, 0),
      visible: false
    },

    kerosene: {
      position: new THREE.Vector3(-2, -3, -2),
      offset: new THREE.Vector3(),
      rotation: new THREE.Euler(0, 0, 0),
      visible: false
    }
  }
});
