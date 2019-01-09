export default { 
  background: new THREE.Color(0x111111),
  camera: {
    position: new THREE.Vector3(0, 0, 5),
    lookAt: new THREE.Vector3()
  },
  earth: {
    globeRadius: 3,
    cloudRadius: 3.02,
    zoningRadius: 3.05
  },

  transitions: {
    all: {
      duration: 500,
      position: {
        from: new THREE.Vector3(0, 0, 3.1),
        to: new THREE.Vector3(0, 0, 8)
      },
      target: {
        from: new THREE.Vector3(0, 0, 0),
        to: new THREE.Vector3(0, 0, 0)
      },
      postprocess: {
        duration: 400,
        bloom: {
          min: 0.1,
          max: 6,
          diff: 5.7
        }
      }
    }
  } 
}
