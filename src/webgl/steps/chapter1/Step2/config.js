import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";
import particleConfig from "~/webgl/components/ParticleCloud/config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  transitions: [
    {
      object: 'step_1_human_leaf_scene',
      duration: 3600,
      position: new THREE.Vector3(-30, 1.76, 0.96),
      rotation: new THREE.Euler(0.46, 0.2, -0.18)
    }
  ],
  modelAnimation: {
    name : 'step_1_human_leaf',
    options: {
      timeScale: 0.0009
    },
    clips: [
      {
        name: 'hang-out',
        firstFrame: 0,
        lastFrame: 70,
      },
      {
        name: 'move-in-wind',
        firstFrame: 70,
        lastFrame: 171,
      },
      {
        name: 'idle',
        firstFrame: 171,
        lastFrame: 212
      }
    ]
  }, 

  sounds: [
    {
      name : 'chapter_1_ambiance',
      spriteName: 'step_2'
    },
    {
      name : 'chapter_1_trigger',
      spriteName: 'step_2_01_feuille_arrachee'
    },
  ],

  micro: {
    colorPlane: colorPlane.extends({
      color: new THREE.Color("rgb(28,75,30)")
    }),

    bondMaterial: {
      color: new THREE.Color("rgb(0, 158, 46)"),
      emissive: new THREE.Color("rgb(51, 73, 59)"),
      envMapIntensity: 1,
    },

    molecules: {
      cocaine: {
        position: new THREE.Vector3(-1, 0, 2),
        scale: new THREE.Vector3(0.4, 0.4, 0.4)
      },
      benzoylecgonine: {
        position: new THREE.Vector3(7, 2, -5),
        scale: new THREE.Vector3(1.2, 1.2, 1.2)
      },
      cinnamoylcocaine: {
        position: new THREE.Vector3(-5, 1, -1),
        scale: new THREE.Vector3(0.6, 0.6, 0.6)
      }
    },

    particleConfig: particleConfig.extends({
      color: new THREE.Color("rgb(114,248,145)")
    }),

    rendering: {
      toneMappingExposure: 0.7,
      toneMappingWhitePoint: 1,
      light: {
        primary: {
          intensity: 1,
          decay: 1,
          power: 13,
          color: new THREE.Color("rgb(71, 183, 66)")
        },
        secondary: {
          intensity: 1,
          decay: 1,
          power: 13,
          color: new THREE.Color("rgb(155,220,151)")
        }
      }
    }
  },
  
  human: {
    rendering: {
      light: {
        primary: {
          intensity: 1
        },
        secondary: {
          intensity: 0.5
        },
        ambient: {
          intensity: 1.5
        }
      },
      bokeh: {
        aperture: 0.15 // Animate to 0 in js
      }
    },
    air: {
      bokeh: {
        aperture: 0
      }
    }
  }
})
