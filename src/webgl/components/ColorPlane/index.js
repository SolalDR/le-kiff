import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import {Brownian} from "noisadelic";
// import config from "./config";

class ColorPlane {

  constructor({
    gui = null,
    config = null
  } = {}){
    var geometry = new THREE.PlaneGeometry(500, 500, 1, 1)
    var noise = new Brownian({});
    var texture = new THREE.Texture(noise.convertImage());
    texture.needsUpdate = true;
    var material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {type: "v", value: config.color },
        u_time: {type: "f", value: 0},
        u_texture: {type: "t", value: texture}
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })
    
    var folder = gui.addFolder("Plane background");
    folder.addThreeColor(config, "color");
    
    return new THREE.Mesh(geometry, material);
  }
  
}

export default ColorPlane;
