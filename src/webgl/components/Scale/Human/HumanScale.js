import Scale from "../Scale";
import AssetsManager from "../../../../services/assetsManager/AssetsManager";

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
    this.group.add(e.step_1_human_leaf.result.scene);
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
