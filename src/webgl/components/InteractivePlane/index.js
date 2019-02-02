import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

class InteractivePlane {

  constructor({
    gui = null,
    front = null,
    back = null,
    size = null
  } = {}){

    this.front = front;
    this.back = back;
    var aspect = this.front.image.width/this.front.image.height;
    var geometry = new THREE.PlaneGeometry(size, size/aspect);
  
    var material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {type: "v", value: new THREE.Color("#0e2a0e")},
        u_time: {type: "f", value: 0},
        u_texture_front: {type: "t", value: this.front},
        u_texture_back: {type: "t", value: this.back},
        u_opacity: {type: "f", value: 1.},
        u_offset_front: {type: "v2", value: new THREE.Vector2(0.0, 0.0)},
        u_offset_back: {type: "v2", value: new THREE.Vector2(0.0, 0.0)},
        u_zoom: {type: "f", value: 1.}
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.object3D = new THREE.Mesh(geometry, material);

    if( gui ){
      this.initGUI(gui);
    }
  }

  set opacity(value) {
    this.object3D.material.uniforms.opacity.value = Math.max(Math.min(value, 1.), 0.);
  }

  get opacity() {
    return this.object3D.material.uniforms.opacity.value;
  }

  set offsetFront(vec2) {
    this.object3D.uniforms.u_offset_front.value = vec2;
  }
  
  set offsetBack(vec2) {
    this.object3D.uniforms.u_offset_back.value = vec2;
  }

  initGUI(gui){
    var folder = gui.addFolder("Interactiv\e Plane");
    folder.add(this.object3D.material.uniforms.u_opacity, "value", 0, 1).name("Opacity");
    folder.addVector("offset front", this.object3D.material.uniforms.u_offset_front.value);
    folder.addVector("offset back", this.object3D.material.uniforms.u_offset_back.value);
  }
}

export default InteractivePlane;
