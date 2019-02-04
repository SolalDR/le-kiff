import baseConfig from "./../../config";

export default baseConfig.extends({
  background: new THREE.Color(0xf2f3ee),
  assets: [
    "background",
    "step_1_human_leaf"
  ],
  transforms: [
    {
      asset: 'step_1_human_leaf',
      position: new THREE.Vector3(-0.98, -1.18, -1.12),
      rotation: new THREE.Euler(-0.16, 0.1, -0.38)
    }
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
      name : "chapter_1_main_voice",
      options : {
        volume: 0.9
      } 
    }
  ],
  micro: {
    atomMaterial: {
      // Test extends config step2
      // color: new THREE.Color("rgb(172, 103, 29)")
    }
  }
})
