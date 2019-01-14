import { c } from "../../../../helpers/Configuration";
import baseConfig from "./../config";

export default baseConfig.extends({
  camera: {
    position: new THREE.Vector3(0, 0, 5),
  },

  transitions: {
    micro: {
      position: {
        from: new THREE.Vector3(0, 0, 0),
        to: new THREE.Vector3(0, 0, 8)
      },
      postprocess: {
        bloom: {
          strength: {
            from: 2.5,
            to: 0.1          
          }
        }
      }
    },

    macro: {
      position: {
        from: new THREE.Vector3(0, 10, 25),
        to: new THREE.Vector3(0, 0, 8)
      },

      target: {
        from: new THREE.Vector3(0, 10, 0)
      },
      
      postprocess: {
        duration: 500,
        bloom: {
          strength: {
            from: 2.5,
            to: 0.1
          }
        }
      }
    }
  }
});
