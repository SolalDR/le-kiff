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
    this.mainRootName = this.mainRoot.name;
    this.main.name = "main-step-2";

    // create clips from current scene model anims
    ModelAnimationManager.createClips(this.mainRoot, config.modelAnimation.clips, config.modelAnimation.options)

    // TODO: add possibility to set active model to only call play('clipName')
    ModelAnimationManager.play(this.mainRootName, 'hang-out').then(() => {
      
      var startPosition = this.main.position.clone();
      var startRotation = this.main.rotation.clone();

      AnimationManager.addAnimation(new Animation({
        duration: 3600, 
        timingFunction: "easeInOutQuad"
      }).on("progress", ( event ) => {
        var a = event.advancement;
        var lerp = THREE.Math.lerp;
        this.main.position.x = lerp(startPosition.x, -30, a);
        this.main.position.y = lerp(startPosition.y, 1.76, a);
        this.main.position.z = lerp(startPosition.z, 0.96, a);
        this.main.rotation.x = lerp(startRotation.x, 0.46, a);
        this.main.rotation.y = lerp(startRotation.y, 0.20, a);
        this.main.rotation.z = lerp(startRotation.z, -0.18, a);
      }).on("end", () => {
        console.log('branch anim end');
      }));

      ModelAnimationManager.play(this.mainRootName, 'move-in-wind').then(() => {
        ModelAnimationManager.play(this.mainRootName, 'idle').then(() => {
          ModelAnimationManager.play(this.mainRootName, 'cut');
        })
      });
    });
  }

  display( isNextStep = false, event ) {
    this.displayHumanScale( event );
    super.display( event );
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
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
