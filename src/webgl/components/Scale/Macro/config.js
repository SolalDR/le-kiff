import { c } from "../../../../helpers/Configuration";
import baseConfig from "./../config";

export default baseConfig.extends({ 
  background: new THREE.Color(0x111111),
  
  camera: {
    position: new THREE.Vector3(0, 0, 5)
  },

  earth: {
    globeRadius: 3,
    cloudRadius: 3.02,
    zoningRadius: 3.05
  },

  transitions: {
    all: {
      duration: 500,
      position: {
        from: new THREE.Vector3(0, 0, 3.1),
        to: new THREE.Vector3(0, 0, 8)
      },

      postprocess: {
        duration: 400,
        bloom: {
          strength: {
            from: 6,
            to: 0.1
          }
        }
      }
    }
  } 
});
