import RadialControl from "./components/RadialControl";
import RailsControl from "./components/RailsControl";
import Bus from "~/helpers/Bus";
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import config from "./config";

class ControllerManager {

  constructor({
    camera = null,
    controller = "radial",
    mouseCaster = null
  } = {}){

    this.camera = camera;
    this.mouseCaster = mouseCaster;
    this.controls = {
      radial: new RadialControl({
        camera: camera,
        mouseCaster: mouseCaster
      }),
      rails: new RailsControl({
        camera: camera
      })
    }

    this.state = {
      controller: null
    }

    this.setController(controller);
    this.initEvents();
  }

  initEvents(){
    Bus.on("scale:coming", ()=>{
      this.stop("radial");
      this.controls.radial.config.factor = 0;
    })

    Bus.on("scale:display", ()=>{
      this.controls.radial.state.coords.phi = 0;
      this.controls.radial.state.coords.theta = Math.PI/2;
      this.start("radial");
      
      AnimationManager.addAnimation(new Animation({ duration: 500, delay: 1000 }).on("progress", (e)=>{
        this.controls.radial.config.factor = config.radial.factor * e.advancement;
      }))
    })
  }

  /**
   * @param {string} name
   */
  setController(name) {
    this.state.controller = this.controls[name];
    this.state.controller.start();
  }

  stop(name) {
    if( this.controls[name].stop ){
      this.controls[name].stop()
      Bus.verbose("controls:stop-controller "+name)
    }
  }

  start(name) {
    if( this.controls[name].start ){
      this.controls[name].start()
      Bus.verbose("controls:start-controller "+name)
    }
  }

  update() {
    if( this.state.controller.type === "radial" ){
      this.state.controller.update();
    }
  }

}

export default ControllerManager;
