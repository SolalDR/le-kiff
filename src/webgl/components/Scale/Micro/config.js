export default {
  background: new THREE.Color(0xf2f3ee),
  
  camera: {
    position: new THREE.Vector3(0, 0, 8),
    lookAt: new THREE.Vector3()
  },

  molecules: {
    cocaine: {
      offset: new THREE.Vector3(-30, -8, 20),
      // position: new THREE.Vector3(8, -1, -10)
      position: new THREE.Vector3(1, 0, -3),
      rotation: new THREE.Euler(0, -1, 0)
    },

    kerosene: {
      position: new THREE.Vector3(-2, -3, -2)
    }
  },

  transitions: {
    all: {
      duration: 2000,
      position: {
        from: new THREE.Vector3(0, 0, 50),
        to: new THREE.Vector3(0, 0, 8)
      },

      target: {
        from: new THREE.Vector3(0, 0, 0),
        to: new THREE.Vector3(0, 0, 0)
      },
      
      postprocess: {
        duration: 1000,
        bloom: {
          min: 0.1,
          max: 10
        }
      }
    }
  }
};
