import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  modelAnimation: {
    name : 'coca-plant',
    options: {
      timeScale: 0.0009
    },
    clips: [
      {
        name: 'cut',
        firstFrame: 213,
        lastFrame: 264,
      }
    ]
  },
})
