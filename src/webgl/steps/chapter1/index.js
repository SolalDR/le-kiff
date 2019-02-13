import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'

import * as THREE from "three";
import ExtendedMaterial from "~/webgl/components/ExtendedMaterial";


export const init = (ressources, main) => {
  
  var mat = ExtendedMaterial(ressources.step_4_pasta.result.scene.children[0].children[0].material, 
    [ { u_base_color : { type:"v3", value: new THREE.Color(0, 0, 0)} } ],
    [
      {
        needle:'#include <map_fragment>', 
        fragment: `
        #ifdef USE_MAP
          vec4 texelColor = texture2D( map, vUv );
          texelColor = mapTexelToLinear( texelColor );
          diffuseColor *= texelColor;
          diffuseColor.xyz += u_base_color;
        #endif
        ` 
      },
      { 
        needle: "uniform float metalness;",
        fragment:`
        uniform float metalness;
        uniform vec3 u_base_color;
        `
      }
    ]
  )

  ressources.step_4_pasta.result.scene.children[0].children.forEach(mesh => {
    mesh.material = mat;
  })


  main.threeScene.add(ressources.step_4_pasta.result.scene);

  main.renderer.renderer.setTexture2D(ressources.background1.result);
  main.renderer.renderer.setTexture2D(ressources.background2.result);
  main.renderer.renderer.setTexture2D(ressources.background3.result);
  main.renderer.renderer.setTexture2D(ressources.background4.result);
  main.renderer.renderer.setTexture2D(ressources.background6.result);
  
  main.renderer.renderer.setTexture2D(ressources.mapLeaf.result);
  main.renderer.renderer.setTexture2D(ressources.alphaLeaf.result);
  main.renderer.renderer.setTexture2D(ressources.alphaWaterLeaf.result);
  main.renderer.renderer.setTexture2D(ressources.normalLeaf.result);
  main.renderer.renderer.setTexture2D(ressources.roughnessLeaf.result);

  main.renderer.renderer.render(main.threeScene, main.camera);

  main.threeScene.remove(ressources.step_4_pasta.result.scene);
}

export default [
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6
]
