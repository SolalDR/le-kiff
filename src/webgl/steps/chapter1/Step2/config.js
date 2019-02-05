import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  transitions: [
    {
      object: 'step_1_human_leaf',
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
        lastFrame: 213,
        loop: THREE.LoopRepeat,
      }
    ]
  }, 
  sounds: [
    {
      name : "step_2_main_sound", 
      options : {
        volume: 0.9
      }
    },
    {
      name : "step_1_background_sound"
    }
  ],
  micro: {
    molecules: {
      cocaine: {
        position: new THREE.Vector3(-2, 0, 1),
        scale: new THREE.Vector3(0.5, 0.5, 0.5)
      },
      benzoylecgonine: {
        position: new THREE.Vector3(7, 1, 0),
        scale: new THREE.Vector3(0.8, 0.8, 0.8)
      },
      cinnamoylcocaine: {
        position: new THREE.Vector3(-7, 0, -3),
        scale: new THREE.Vector3(1.2, 1.2, 1.2)
      }
    },
    atomMaterial: { }
  }

})
