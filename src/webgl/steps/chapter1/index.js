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


// #define PHYSICAL
// uniform vec3 diffuse;
// uniform vec3 emissive;
// uniform float roughness;
// uniform float metalness;
// uniform float opacity;
// #ifndef STANDARD
// 	uniform float clearCoat;
// 	uniform float clearCoatRoughness;
// #endif
// varying vec3 vViewPosition;
// #ifndef FLAT_SHADED
// 	varying vec3 vNormal;
// #endif
// #include <common>
// #include <packing>
// #include <dithering_pars_fragment>
// #include <color_pars_fragment>
// #include <uv_pars_fragment>
// #include <uv2_pars_fragment>
// #include <map_pars_fragment>
// #include <alphamap_pars_fragment>
// #include <aomap_pars_fragment>
// #include <lightmap_pars_fragment>
// #include <emissivemap_pars_fragment>
// #include <bsdfs>
// #include <cube_uv_reflection_fragment>
// #include <envmap_pars_fragment>
// #include <envmap_physical_pars_fragment>
// #include <fog_pars_fragment>
// #include <lights_pars_begin>
// #include <lights_physical_pars_fragment>
// #include <shadowmap_pars_fragment>
// #include <bumpmap_pars_fragment>
// #include <normalmap_pars_fragment>
// #include <roughnessmap_pars_fragment>
// #include <metalnessmap_pars_fragment>
// #include <logdepthbuf_pars_fragment>
// #include <clipping_planes_pars_fragment>
// void main() {
// 	#include <clipping_planes_fragment>
// 	vec4 diffuseColor = vec4( diffuse, opacity );
// 	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
// 	vec3 totalEmissiveRadiance = emissive;
// 	#include <logdepthbuf_fragment>
// 	#include <map_fragment>
// 	#include <color_fragment>
// 	#include <alphamap_fragment>
// 	#include <alphatest_fragment>
// 	#include <roughnessmap_fragment>
// 	#include <metalnessmap_fragment>
// 	#include <normal_fragment_begin>
// 	#include <normal_fragment_maps>
// 	#include <emissivemap_fragment>
// 	#include <lights_physical_fragment>
// 	#include <lights_fragment_begin>
// 	#include <lights_fragment_maps>
// 	#include <lights_fragment_end>
// 	#include <aomap_fragment>
// 	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
// 	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
// 	#include <tonemapping_fragment>
// 	#include <encodings_fragment>
// 	#include <fog_fragment>
// 	#include <premultiplied_alpha_fragment>
// 	#include <dithering_fragment>
// }
