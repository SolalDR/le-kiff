import Step from "./../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import FitPlane from "~/webgl/components/Scale/Human/components/FitPlane"
import InfoManager from "~/webgl/components/Info/InfoManager"


/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  /**
   * This method initialize the step and 
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( previousStep ) {
    super.init({
      assets: [
        "background",
        "step_1_human_leaf"
      ]
    });

    this.folder = {};
    if( AssetsManager.loader.isLoaded("chapter-1") ) {
      this.display(previousStep, AssetsManager.loader.getFiles("chapter-1"));
    }

    AssetsManager.loader.once("load:chapter-1", (event) => {
      this.display( previousStep, event )
    })
  }

  initHumanScale( e ){
    this.main = e.step_1_human_leaf.result.scene;
    this.main.name = "main-step-1";
    
    this.scene.humanScale.group.add(this.main);
    var background = new FitPlane({
      background: e.background.result, 
      size: 450,
      distance: 100
    });

    this.main.scale.y = 1;
    this.main.position.x = -1;
    this.main.position.y = -4.5;
    this.main.rotation.z = 0.2;
    this.folder.leaf = this.gui.addObject3D("Leaf",  this.main, false);

    this.scene.humanScale.group.add(background.object3D);
  }

  display( isNextStep = false, event ) {
    // this.scene.macroScale.updateFromStep(this);
    // this.scene.microScale.updateFromStep(this);
    this.initHumanScale( event );
    super.display();
  }

  hide() {  
    this.scene.humanScale.group.remove(this.main);
    this.gui.removeFolder(this.folder.leaf);
    super.hide();
  }
}
