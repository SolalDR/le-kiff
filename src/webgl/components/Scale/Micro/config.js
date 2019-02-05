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
      offset: new THREE.Vector3(-27, -10, 14),
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(0, -1, 0),
      scale: new THREE.Vector3(1, 1, 1),
      visible: false
    },

    kerosene: {
      position: new THREE.Vector3(0, 0, 0),
      offset: new THREE.Vector3(-1, -2, 0),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, -1, 0),
      visible: false
    },

    acide_chlorhydrique: {
      position: new THREE.Vector3(-5, -1, 1),
      offset: new THREE.Vector3(),
      scale: new THREE.Vector3(0.8),
      rotation: new THREE.Euler(0, 0, 0),
      visible: false
    },

    acide_sulfurique: {
      offset: new THREE.Vector3(-2, 0, 0),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(0.8),
      rotation: new THREE.Euler(0, -5, 0),
      visible: false
    },

    ether: {
      offset: new THREE.Vector3(-1, 1, 0),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(0.8),
      rotation: new THREE.Euler(2, -1, -5),
      visible: false
    },

    water: {
      offset: new THREE.Vector3(-1, .5, 0),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(0.8),
      rotation: new THREE.Euler(0, -1, 0),
      visible: false
    },

    ammoniac: {
      offset: new THREE.Vector3(-2, 2, 0),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(0.8),
      rotation: new THREE.Euler(0, -1, 0),
      visible: false
    },

    benzoylecgonine: {
      offset: new THREE.Vector3(0, 5, -8),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(-0.5, 0, 0),
      visible: false
    },

    chaux_vive: {
      offset: new THREE.Vector3(-3, 0, 1),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(0.8),
      rotation: new THREE.Euler(0, -1, 0),
      visible: false
    },
    
    cinnamoylcocaine: {
      offset: new THREE.Vector3(-3, 0, -5),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, 0, 0),
      visible: false
    }

  }
});
