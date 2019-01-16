import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
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
  ]
})
