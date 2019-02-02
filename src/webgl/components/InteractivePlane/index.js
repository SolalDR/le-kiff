import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

class InteractivePlane {

  constructor({
    gui = null,
    background = null,
    size = null
  } = {}){

    this.background = background;
    var aspect = this.background.image.width/this.background.image.height;
    var geometry = new THREE.PlaneGeometry(size, size/aspect);
  
    var material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {type: "v", value: new THREE.Color("#0e2a0e")},
        u_time: {type: "f", value: 0},
        u_texture_front: {type: "t", value: null},
        u_texture_back: {type: "t", value: null},
        point: {type: "v3", value: new THREE.Vector2(0.5, 0.5)},
        direction: {type: "v3", value: new THREE.Vector2(1.0, 0.)}
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.object3D = new THREE.Mesh(geometry, material);
  }
}

export default InteractivePlane;
