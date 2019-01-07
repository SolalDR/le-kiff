import Scale from "../Scale";
import AssetsManager from "~/services/assetsManager/AssetsManager";
import FitPlane from "./components/FitPlane";
import gui from "~/services/gui";
import AnimationManager from "./../../../AnimationManager";
import Animation from "~/helpers/Animation";
import { humanConfig } from "~/webgl/config";
import * as THREE from "three";

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
