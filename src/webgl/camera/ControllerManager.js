import ParalaxControl from "./ParalaxControl";
import OrbitControls from "./OrbitControls";
import RadialControl from "./RadialControl";

class ControllerManager {
  constructor({
    camera = null,
    controller = "orbit",
    mouseCaster = null
  } = {}){
    this.camera = camera;
    this.mouseCaster = mouseCaster;
    this.controls = {
      orbit: new OrbitControls(camera),
      paralax: new ParalaxControl({
        camera: camera,
        mouseCaster: mouseCaster
      }),
      radial: new RadialControl({
        camera: camera,
        mouseCaster: mouseCaster
      })
    }

    this.state = {
      controller: this.controls[controller]
    }
  }

  /**
   * @param {string} name
   */
  setController(name){
    this.state.controller = this.controls[name];
  }

  update(){
    if( this.state.controller.type === "radial" ){
      this.state.controller.update();
    }
  }

}

export default ControllerManager;
