import baseConfig from "./../config";

export default baseConfig.extends({
  transitions: {

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
      },
      sound: {
        volume: 0.5
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
      },
      sound: {
        volume: 0.5
      } 
    }
  },
  rendering: {
    light: {
      primary: {
        position: new THREE.Vector3(-4, -3, 10),
        intensity: 2.4
      }
    }
  }
});
