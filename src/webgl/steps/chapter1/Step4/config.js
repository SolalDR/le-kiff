import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";
import particleConfig from "~/webgl/components/ParticleCloud/config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  human: {
    transition: {
      micro: {
        position: {
          to: new THREE.Vector3(0, 0, 3)
        }
      },
      macro: {
        position: {
          to: new THREE.Vector3(0, 0, 3)
        }
      }
    },
    rendering: {
      light: {
        primary: {
          position: new THREE.Vector3(0, 15, 0),
          intensity: 1
        },
        secondary: {
          intensity: 0.5
        },
        ambient: {
          intensity: 1
        },
      },
      bokeh: {
        focus: -0.2
      },
      air: {
        light: {
          primary: {
            position: new THREE.Vector3(10, 23, 19),
            intensity: 3.9,
            //power: 9,
            color: new THREE.Color("rgb(250,225,189)")
          },
          secondary: {
            position: new THREE.Vector3(-13, 13, -1),
            color: new THREE.Color("rgb(255,182,100)"),
            intensity: 0.45,
            //power: 11.3,
          },
          ambient: {
            color: new THREE.Color("rgb(255, 224, 180)"),
            intensity: 1,
          },
        },
        bokeh: {
          focus: 0
        }
      },
    },
    air: {
      camera: {
        radius: 3
      },
    }
  },
  micro: {
    bondMaterial: {
      color: new THREE.Color("rgb(138, 81, 0)"),
      emissive: new THREE.Color("rgb(115, 82, 52)"),
    },
    colorPlane: colorPlane.extends({
      color: new THREE.Color("rgb(162, 102, 31)")
    }),
    molecules: {
      cocaine: {
        position: new THREE.Vector3(-2.8, -1, 0),
        scale: new THREE.Vector3(0.8, 0.8, 0.8)
      },
      ammoniac: {
        position: new THREE.Vector3(1.7,1, 0),
        scale: new THREE.Vector3(1.4, 1.4, 1.4)
      }
    },
    particleConfig: particleConfig.extends({
      color: new THREE.Color("rgb(244, 198, 80)")
    }),
    rendering: {
      toneMappingExposure: 0.7,
      toneMappingWhitePoint: 1,
      light: {
        primary: {
          intensity: 0.5,
          decay: 1,
          power: 25,
          color: new THREE.Color("rgb(56, 56, 70)")
        },
        secondary: {
          intensity: 1,
          decay: 1,
          power: 13,
          color: new THREE.Color("rgb(151,171,220)")
        }
      }
    },
  },

  sounds: [
    {
      name : "chapter_1_ambiance",
      spriteName: 'step_4',
      options: {
        volume: 0.3
      }
    }
  ],

  // TODO extend config water
  water: {
    color: new THREE.Color("rgb(100, 85, 14)"),
    position: new THREE.Vector3(0, -2, 7),
    scale: new THREE.Vector3(2, 1, 1)
  }
})
