import { c } from "../../../../helpers/Configuration";
import baseConfig from "./../config";

export default baseConfig.extends({ 
  transitions: {
    all: {
      duration: 500,
      position: {
        from: new THREE.Vector3(0, 0, 3.1)
      },

      postprocess: {
        duration: 400,
        bloom: {
          strength: {
            from: 6
          }
        }
      },
      soundEffect: {
        duration: 1000,
        effects : ['convolver']
      }
    }
  },

  earth: {
    globeRadius: 3,
    cloudRadius: 3.02,
    zoningRadius: 3.05
  }
});
