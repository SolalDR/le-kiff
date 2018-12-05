import * as THREE from "three";
import cloudVert from "./../../../../glsl/cloud.vert"
import cloudFrag from "./../../../../glsl/cloud.frag"
import gui from "~/services/gui";

class Earth {

  constructor(assets, config){

    this.globe = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({ 
        map: assets.diffuse.result, 
        normalMap: assets.normal.result,
        emissiveMap: assets.specular.result,
      })
    );

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.02, 32, 32),
      new THREE.ShaderMaterial({
        vertexShader: cloudVert,
        fragmentShader: cloudFrag,
        uniforms: {
          u_time: { value: 0, type: "f" },
          u_map: { value: assets.cloud.result, type: "t" }, 
          u_noise: { value: assets.noise.result, type: "t" }, 
          u_alpha:  {type: "f", value: 0.5}
        },
        transparent: true
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
