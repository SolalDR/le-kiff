import config from "./config";  
import {Brownian} from "noisadelic";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

class ParticleCloud {

  constructor({
    gui = null
  } = {}) {
    var noise = new Brownian({rgb: true});
    var texture = new THREE.Texture(noise.convertImage());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 512;
    texture.repeat.y = 512;

    texture.needsUpdate = true;

    this.geometry = new THREE.Geometry();
    for(var i=0; i < config.count; i++){
      this.geometry.vertices.push(new THREE.Vector3(
        0.5 - Math.random(),
        0.5 - Math.random(),
        0.5 - Math.random()
      ));
      this.geometry.verticesNeedsUpdate = true;
    }


    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        u_texture: {type: "t", value: texture},
        u_noise_amplitude: {type: "v3", value: config.noise_amplitude},
        u_amplitude: {type: "v3", value: config.amplitude},
        u_time: {type: "f", value: 0},
        u_spread: {type: "f", value: config.spread},
        u_color: {type: "f", value: config.color},
        u_size: {type: "f", value: config.size}
      }
    })

    this.object3D = new THREE.Points(this.geometry, this.material);
    this.object3D.position.copy(config.position);
    this.initGui(gui);
  }

  initGui(gui){
    if( gui ){
      var folder = gui.addObject3D("Particle Cloud", this.object3D);
      folder.addVector("Amplitude", this.material.uniforms.u_amplitude.value);
      folder.addVector("Noise Amplitude", this.material.uniforms.u_noise_amplitude.value);
      folder.add(this.material.uniforms.u_spread, "value", 0, 1).name("Spread noise");
      folder.addThreeColor(this.material.uniforms.u_color, "value").name("Color");
      folder.add(this.material.uniforms.u_size, "value", 0, 10).name("Particle Size");
      folder.add(config, "speed", 0, 0.2).name("Speed");
    }
  }

  render(){
    this.material.uniforms.u_time.value += config.speed;
  }

}

export default ParticleCloud;
