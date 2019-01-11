import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

class InteractivePlane {

  constructor({
    noise = null,
    gui = null
  } = {}){
    var geometry = new THREE.PlaneGeometry(500, 500, 1, 1)
    
    noise.wrapS = THREE.RepeatWrapping;
    noise.wrapT = THREE.RepeatWrapping;
    noise.repeat.x = 1024;
    noise.repeat.y = 1024;

    var material = new THREE.ShaderMaterial({
      uniforms: {
        u_noise: {type: "t", value: noise},
        u_time: {type: "f", value: 0}
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.initGUI(material);
    return new THREE.Mesh(geometry, material);
  }

  initGUI(material){
    
  }
}

export default InteractivePlane;
