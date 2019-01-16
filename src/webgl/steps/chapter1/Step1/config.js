import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  assets: [
    "background",
    "step_1_human_leaf"
  ],
  sounds: [
    {
      name : "step_1_background_sound",
      options : {
        loop: true,
        volume: 0.3
      }
    },
    {
      name : "step_1_main_sound",
      options : {
        volume: 0.9
      }
    }
  ]
  // micro: {
  //   molecules: {
  //     cocaine: {
  //       position: new THREE.Vector3(0, 0, -20)
  //     }
  //   }
  // }
})
