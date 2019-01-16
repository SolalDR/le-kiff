import baseConfig from "./../config";
import fluxConfig from "./components/Flux/config"

export default baseConfig.extends({
  flux: fluxConfig,
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
      sound: {
        volume: 0.7,
        effect: {
          duration: 1000,
          list : ['convolver']
        }
      } 
    }
  },

  earth: {
    globeRadius: 3,
    cloudRadius: 3.02,
    zoningRadius: 3.05
  }
});
