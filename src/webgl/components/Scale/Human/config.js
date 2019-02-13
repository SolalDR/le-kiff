import baseConfig from "./../config";

export default baseConfig.extends({
  transitions: {

    all: {
      sound: {
        volume: 0.1
      } 
    },

    micro: {
      position: {
        from: new THREE.Vector3(0, 0, 0)
      },
      postprocess: {
        bloom: {
          strength: {
            from: 2.5
          }
        }
      }
    },

    macro: {
      position: {
        from: new THREE.Vector3(0, 10, 25)
      },

      target: {
        from: new THREE.Vector3(0, 10, 0)
      },
      
      postprocess: {
        duration: 500,
        bloom: {
          strength: {
            from: 2.5
          }
        }
      }
    }
  },
  rendering: {
    toneMappingExposure: 1,
    light: {
      primary: {
        position: new THREE.Vector3(-4, -3, 10),
        intensity: 2.4
      },
      ambient: {
        intensity: 0.2
      }
    },
    bokeh: {
      focus: 0,
      aperture: 0.02,
      maxblur: 0.1
    },
  }
});
