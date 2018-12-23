import * as THREE from "three";
import gui from "~/services/gui";
import { macroConfig } from "~/webgl/config";

class Earth {

  constructor(assets, config){


    var globeMaterial = new THREE.MeshStandardMaterial({ 
      map: assets.diffuse.result, 
      normalMap: assets.normal.result,
      emissiveMap: assets.specular.result,
      metalness: 1,
      roughness: 0.8, 
      color: new THREE.Color("rgb(170, 170, 170)")
    });

    globeMaterial.onBeforeCompile = shader => {

      shader.uniforms.map_2 = { value: assets.diffuse_night.result };

      shader.vertexShader = shader.vertexShader.replace("#include <common>", `
      #include <common>
      varying float v_sun_expo;
      `);

      shader.vertexShader = shader.vertexShader.replace("#include <uv_vertex>", `
      #include <uv_vertex>
      vec4 trueNormal = modelMatrix * vec4(normal, 1.);
      v_sun_expo = dot(vec3(1.), trueNormal.xyz);
      `);

      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `
      #include <common>
      uniform sampler2D map_2;
      varying float v_sun_expo;
      `);

      shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `
       vec4 diffuseColorStored = diffuseColor; 
      #include <map_fragment>
      if(v_sun_expo < 0.){
        texelColor = texture2D( map_2, vUv );
        texelColor = mapTexelToLinear( texelColor );
        diffuseColor = diffuseColorStored*texelColor;
        //- vec4(4./255., 6./255., 18./255., 0.);
      }
      `);

      shader.fragmentShader = shader.fragmentShader.replace(
        "vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;", 
        `
        vec3 outgoingLight;
        if(v_sun_expo < 0.){
          outgoingLight =  abs(v_sun_expo) * 2. * diffuseColor.xyz + reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
        } else {
          outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
        }
        `);
    }

    this.globe = new THREE.Mesh(
      new THREE.SphereGeometry(macroConfig.earth.globeRadius, 32, 32),
      globeMaterial
    );

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(macroConfig.earth.cloudRadius, 32, 32),
      new THREE.MeshPhongMaterial({
        map: assets.cloud.result,
        alphaMap: assets.cloud.result,
        transparent: true, 
        opacity: 1, 
        shininess: 1,
        specular: new THREE.Color("rgb(128, 128, 128)")
      })
    );

    this.group = new THREE.Group();
    this.group.add(this.globe);
    this.group.add(this.clouds);    

    gui.addMaterial("globe", this.globe.material);
    gui.addMaterial("clouds", this.clouds.material);
    
  }

}

export default Earth;
