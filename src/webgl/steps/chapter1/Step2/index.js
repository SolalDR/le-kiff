import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import SoundManager from "~/services/soundManager/SoundManager";
import config from "./config";
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import { c } from "../../../../helpers/Configuration";
import ModelAnimationManager from "../../../manager/ModelAnimation";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  /** 
   * This method initialize the step and 
   * @param {Step} previousStep previous step in History
   */
  init( previousStep ) {
    super.init(config, previousStep);
    this.display(AssetsManager.loader.getFiles("chapter-1"));
  }

  /**
   * Init human scale scene 
   * @param {*} event
   */
  displayHumanScale( event ){
    this.main = event.step_1_human_leaf.result.scene;
    this.main.name = "main-step-2";
    this.mainRoot = event.step_1_human_leaf.result;
    this.mainRoot.name = config.modelAnimation.name;


    // TODO: in Step.js ?
    // create clips from current scene model anims
    ModelAnimationManager.generateClips(this.mainRoot, config.modelAnimation.clips, config.modelAnimation.options);
      
    ModelAnimationManager.play('hang-out').then(() => {
      var mainPosition = this.main.position.clone();
      var mainRotation = this.main.rotation.toVector3();
      var targetRotation = new THREE.Vector3()

      
      // TODO : make it generic
      const mainTransitionData = config.transitions.find(u => u.object === this.main.name); 
      AnimationManager.addAnimation(new Animation({
        duration: mainTransitionData.duration, 
        timingFunction: "easeInOutQuad"
      }).on("progress", ( event ) => {
        var a = event.advancement;
        this.main.position.lerpVectors(mainPosition, mainTransitionData.position, a);
        targetRotation.lerpVectors(mainRotation, mainTransitionData.rotation, a);
        this.main.rotation.setFromVector3(targetRotation);
      }).on("end", () => {
        console.log('branch anim end');
      }));
      
      ModelAnimationManager.play('move-in-wind').then(() => {
        ModelAnimationManager.play('idle');
      });
    });
  }

  display( event ) {
    this.displayHumanScale( event );
    super.display( event );
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    super.hide();
  }
}
