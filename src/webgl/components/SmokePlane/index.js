import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

class SmokePlane {

  constructor({
    noise = null,
    gui = null
  } = {}){

    // var noise = new THREE.CanvasTexture(this.noise.canvas);
    // guiMicro.add(this.noise, "density", 0, 20).onChange(()=>{
    //   this.noise.draw();
    //   noise.needsUpdate = true;
    // });

    // guiMicro.add(this.noise, "exposition", 0, 1).onChange(()=>{
    //   this.noise.draw();
    //   noise.needsUpdate = true;
    // });


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

export default SmokePlane;
