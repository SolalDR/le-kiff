import baseConfig from "./../config";
import fluxConfig from "./components/Flux/config"

export default baseConfig.extends({
  flux: fluxConfig,

  earth: {
    globeRadius: 3,
    cloudRadius: 3.02,
    zoningRadius: 3.05
  },

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
            from: 6,
            to: 0.1
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

  rendering: {
    light: {
      primary: {
        position: new THREE.Vector3(-2, 0, 7),
        intensity: 3.3,
        color: new THREE.Color(0xffffff)
      }
    },
    bokeh: {
      focus: 450,
      aperture: 0.5,
      maxblur: 3
    },
    bloom: {
      // threshold: 0.99,
      strength: 3,
      radius: 1
    }
  }

});
