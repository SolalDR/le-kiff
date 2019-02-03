import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import AnimationManager, {Animation} from "~/webgl/manager/Animation"

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
  }

  changeBackground(background, duration = 1000, delay = 0){
    if( duration ){
      this.back = background;
      this.object3D.material.uniforms.u_texture_back.value = this.back;
      this.object3D.material.uniforms.u_opacity.value = 1.;

      AnimationManager.addAnimation(new Animation({ duration, delay })
        .on("progress", (event)=>{
          this.object3D.material.uniforms.u_opacity.value = 1. - event.advancement;
        }).on("end", (event) => {
          this.object3D.material.uniforms.u_opacity.value = 1.;
          this.object3D.material.uniforms.u_texture_front.value = background;
        })
      )
    } else {
      this.back = this.front;
      this.front = background;
      this.object3D.material.uniforms.u_texture_front.value = this.front;
      this.object3D.material.uniforms.u_texture_back.value = this.back;
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
}

export default InteractivePlane;
