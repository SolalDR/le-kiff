import Scale from "../Scale";
import AssetsManager from "~/services/assetsManager/AssetsManager";
import FitPlane from "./components/FitPlane";
import gui from "~/services/gui";

class HumanScale extends Scale {
 
  /**
   * @constructor
   * @param {THREE.Scene} args.scene
   */
  constructor(args){
    super({...args, name: "human"});
    this.state = {
      ...this.state
    }

    this.init();
  }

  initScene(e){
    this.main = e.step_1_human_leaf.result.scene;
    
    this.group.add(this.main);
    var background = new FitPlane({
      background: e.step_1_background.result, 
      size: 450,
      distance: 100
    });

    this.main.scale.y = 1.5;
    this.main.rotation.z = -0.6;
    this.main.position.x = -7;
    this.main.position.y = -4;
    gui.addObject3D("Leaf",  this.main, false);


    this.group.add(background.object3D);

    this.dispatch('initScene', this);
  }

  init(){
    super.init();
    if( AssetsManager.loader.isLoaded("chapter-1") ) {
      this.initScene(AssetsManager.loader.getFiles("chapter-1"));
    }
    AssetsManager.loader.once("load:chapter-1", (event) => this.initScene( event ))
  }

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
    if( (this.state.currentScale === "human" && this.state.previousScale === "micro") ||
      this.state.currentScale === "micro"  ){
      this.group.scale.x = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.y = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.z = 1 + (2 - this.state.currentVisibility*2);
      return;
    }
    
    if( this.state.currentScale === "human" || 
      this.state.currentScale === "macro" ){
      this.group.scale.x = this.state.currentVisibility;
      this.group.scale.y = this.state.currentVisibility;
      this.group.scale.z = this.state.currentVisibility;
      return;
    }
  }
}

export default HumanScale;
