import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  assets: [
    "background",
    "step_1_human_leaf"
  ]
  // micro: {
  //   molecules: {
  //     cocaine: {
  //       position: new THREE.Vector3(0, 0, -20)
  //     }
  //   }
  // }
})
