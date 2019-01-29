import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import ModelAnimationManager from "../../../manager/ModelAnimation";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  /**
   * This method initialize the step and 
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( isNextStep ) {
    super.init(config);
    this.display(isNextStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  /**
   * Init human scale scene 
   * @param {*} event
   */
  displayHumanScale( event ){
    this.main = event.step_1_human_leaf.result.scene;
    this.mainRoot = event.step_1_human_leaf.result;
    this.mainRoot.name = config.modelAnimation.name;
    this.main.name = "main-step-3"

    this.scene.humanScale.group.add(this.main);

    // create clips from current scene model anims
    ModelAnimationManager.generateClips(this.mainRoot, config.modelAnimation.clips, config.modelAnimation.options)
    ModelAnimationManager.play('cut');
  }

  display( isNextStep = false, event ) {
    this.displayHumanScale( event );
    super.display( event );
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    super.hide();
  }
}
