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

    // create clips from current scene model anims
    ModelAnimationManager.generateClips(this.mainRoot, config.modelAnimation.clips, config.modelAnimation.options);
      
    ModelAnimationManager.play('hang-out').then(() => {
      var startPosition = this.main.position.clone();
      var startRotation = this.main.rotation.clone();


      
      // AnimationManager.addAnimation(new Animation({
      //   duration: 3600, 
      //   timingFunction: "easeInOutQuad"
      // }).on("progress", ( event ) => {
      //   var a = event.advancement;
      //   var lerp = THREE.Math.lerp;
      //   this.main.position.x = lerp(startPosition.x, -30, a);
      //   this.main.position.y = lerp(startPosition.y, 1.76, a);
      //   this.main.position.z = lerp(startPosition.z, 0.96, a);
      //   this.main.rotation.x = lerp(startRotation.x, 0.46, a);
      //   this.main.rotation.y = lerp(startRotation.y, 0.20, a);
      //   this.main.rotation.z = lerp(startRotation.z, -0.18, a);
      // }).on("end", () => {
      //   console.log('branch anim end');
      // }));

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

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
  }
}
