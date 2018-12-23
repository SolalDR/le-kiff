import OrbitControls from "./OrbitControls";
import RadialControl from "./RadialControl";
import RailsControl from "./RailsControl";

class ControllerManager {
  constructor({
    camera = null,
    controller = "rails",
    mouseCaster = null
  } = {}){
    this.camera = camera;
    this.mouseCaster = mouseCaster;
    this.controls = {
      // orbit: new OrbitControls(camera),
      radial: new RadialControl({
        camera: camera,
        mouseCaster: mouseCaster
      }),
      rails: new RailsControl({
        camera: camera
      })
    }

    this.state = {
      controller: this.controls[controller]
    }

    window.controller = this;
    this.initEvents();
  }

  /**
   * @param {string} name
   */
  setController(name){
    this.state.controller = this.controls[name];
  }

  initEvents(){

  }

  update(){
    if( this.state.controller.type === "radial" ){
      this.state.controller.update();
    }
  }

}

export default ControllerManager;
