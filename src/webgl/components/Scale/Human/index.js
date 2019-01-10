import Scale from "../Scale";
import config from "./config";

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

  display( previous, next ){
    super.display( config.transitions[previous] );
  }

  hide( previous, next ){
    super.hide( config.transitions[next] );
  }

  
  init(){
    super.init();
  }

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
  }
}

export default HumanScale;
