import baseConfig from "./../../config";
import colorPlane from "./../../../components/ColorPlane/config";

console.log(colorPlane);

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
      name : "step_1_main_sound",
      options : {
        volume: 0.9
      }
    }
  ],
  micro: {
    colorPlane: colorPlane.extends({
      color: new THREE.Color("rgb(199,73,21)")
    }),
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
