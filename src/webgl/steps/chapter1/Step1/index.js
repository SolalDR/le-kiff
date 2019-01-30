import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import FitPlane from "~/webgl/components/Scale/Human/components/FitPlane"
import config from "./config";
import { c } from "../../../../helpers/Configuration";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  /**
   * This method initialize the step and 
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( previousStep ) {
    super.init(config);
    this.folder = {}; 
    this.display(previousStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  displayHumanScale( e ){
    this.main = e.step_1_human_leaf.result.scene;
    this.main.name = "main-step-1";
    
    this.scene.humanScale.group.add(this.main);
    this.background = new FitPlane({
      background: e.background.result, 
      size: 450,
      distance: 100
    });

    // main transform
    this.main.scale.y = 1;
    this.main.position.set(-0.98, -1.18, -1.12);
    this.main.rotation.set(-0.16, 0.1, -0.38);
    
    // add leaf folder
    this.folder.leaf = this.gui.addObject3D("Leaf",  this.main, false);
    this.folder.leaf.addMaterial('Leaf detached', this.main.children[0].children[0].material); 
    this.folder.leaf.addMaterial('Leaf', this.main.children[2].material); 

    // Add background
    this.scene.humanScale.group.add(this.background.object3D);
    
  }

  display( isNextStep = false, event ) {
    this.displayHumanScale( event );
    super.display( event );
  }

  hide() {
    //this.scene.humanScale.group.remove(this.main);
    this.gui.removeFolder(this.folder.leaf);
    super.hide();
  } 

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
  }
}
