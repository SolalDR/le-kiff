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

  initScene(e){
    this.main = e.step_1_human_leaf.result.scene;
    
    this.group.add(this.main);
    var background = new FitPlane({
      background: e.step_1_background.result, 
      size: 450,
      distance: 100
    });

    this.main.scale.y = 1;
    this.main.position.x = -1;
    this.main.position.y = -4.5;
    this.main.rotation.z = 0.2;
    gui.addObject3D("Leaf",  this.main, false);


    this.group.add(background.object3D);

    this.dispatch('initScene', this);
  }

  display( previous, next ){
    super.display( humanConfig.transitions[previous] );
  }

  hide( previous, next ){
    super.hide( humanConfig.transitions[next] );
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
  }
}

export default HumanScale;
