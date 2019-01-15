import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

class InteractivePlane {

  constructor({
    gui = null
  } = {}){
    var geometry = new THREE.PlaneGeometry(500, 500, 1, 1)

    var material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {type: "v", value: new THREE.Color("#0e2a0e")},
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
