import baseConfig from "./../config";
import colorPlane from "./../../ColorPlane/config";

export default baseConfig.extends({  
  transitions: {
    all: {
      position: {
        from: new THREE.Vector3(0, 0, 50)
      },
      postprocess: {
        bloom: {
          strength: {
            from: 12,
            to: 0.37
          }
        }
      },
      sound: {
        volume: 0.9,
        effect: {
          duration: 1000,
          list : ['moogfilter']
        }
      }
    }
  },

  bondMaterial: {
    envMapIntensity: 2,
    color: new THREE.Color("rgb(0, 158, 46)"),
    emissive: new THREE.Color("rgb(51, 73, 59)"),
  },

  atomMaterial: {
    envMapIntensity: 0,
    color: new THREE.Color("rgb(0, 0, 0)"),
    emissive: new THREE.Color("rgb(0, 0, 0)")
  },

  colorPlane: colorPlane.extends({
    position: new THREE.Vector3(0, 0, -100)
  }),

  particleCloud: {
    // TODO Implement from particle cloud
  },

  rendering: {
    toneMappingExposure: 0.7,
    light: {
      primary: {
        color: new THREE.Color(155, 220, 151)
      },
      secondary: {
        color: new THREE.Color(155, 220, 151)
      }
    },
    bokeh: {
      focus: 10,
      aperture: 10,
      maxblur: 1.55
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
