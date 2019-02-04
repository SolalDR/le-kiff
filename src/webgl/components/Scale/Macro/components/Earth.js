
import {guiMacro} from "~/services/gui";
import ConfigManager from "~/services/ConfigManager";


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

    this.config = ConfigManager.config.macro;

    globeMaterial.onBeforeCompile = shader => {
      shader.uniforms.map_2 = { value: assets.diffuse_night.result };
      shader.uniforms.u_light_position = { value: new THREE.Vector3(2, 0, 7) };

      shader.vertexShader = shader.vertexShader.replace("#include <common>", `
      #include <common>
      uniform vec3 u_light_position;
      varying float v_sun_expo;
      `);

      shader.vertexShader = shader.vertexShader.replace("#include <uv_vertex>", `
      #include <uv_vertex>
      vec4 trueNormal = modelMatrix * vec4(normal, 1.);
      v_sun_expo = dot(u_light_position, trueNormal.xyz);
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
      new THREE.SphereGeometry(this.config.earth.globeRadius, 32, 32),
      globeMaterial
    );
    this.globe.name = "globe";

    this.globe.rotation.y = -0.5;

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(this.config.earth.cloudRadius, 32, 32),
      new THREE.MeshPhongMaterial({
        map: assets.cloud.result,
        alphaMap: assets.cloud.result,
        transparent: true, 
        opacity: 0.5,
        shininess: 1,
        specular: new THREE.Color("rgb(128, 128, 128)")
      })
    );

    this.group = new THREE.Group();
    this.group.add(this.globe);
    this.group.add(this.clouds);

    guiMacro.addMesh("Mesh Globe", this.globe);
    guiMacro.addMesh("Mesh Clouds", this.clouds);
    
  }

}

export default Earth;
