import Scale from "../Scale";
import { humanConfig } from "~/webgl/config";

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
    super.display( humanConfig.transitions[previous] );
  }

  hide( previous, next ){
    super.hide( humanConfig.transitions[next] );
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
