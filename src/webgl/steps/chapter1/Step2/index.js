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
  constructor(params){
    super(params, ["leaf", "background"]);
    this.mixers = [];
    this.animations = [];
  }

  /** 
   * This method initialize the step and launch display method
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( previousStep = null ) {
    super.init(config, previousStep);
    this.display(previousStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  /**
   * Display the initialized step and launch human scale by default
   * @param {bool} isNextStep 
   * @param {object} ressources 
   */
  display( previousStep = null, ressources ) {
    this.displayHumanScale( ressources, previousStep );
    super.display( ressources );
  }

  /**
   * Display human scale scene 
   * @param {*} ressources
   */
  displayHumanScale( ressources, previousStep ){
    // TODO: previousStep.leaf;
    this.leaf = ressources.step_1_human_leaf.result;
    this.leaf.name = config.modelAnimation.name;;
    var main = ressources.step_1_human_leaf.result.scene;
    main.name = 'step_1_human_leaf';
    
    if (previousStep.background){
      this.background = previousStep.background;
      this.background.changeBackground(ressources.background2.result, 3000, 3000);
    }
    
    ModelAnimationManager.generateClips(this.leaf, config.modelAnimation.clips, config.modelAnimation.options);     
    ModelAnimationManager.play('hang-out').then((e) => {

      var mainPosition = this.leaf.scene.position.clone();
      var mainRotation = this.leaf.scene.rotation.toVector3();
      var targetRotation = new THREE.Vector3()
      const mainTransitionData = config.transitions.find(u => u.object === this.leaf.name); 
      AnimationManager.addAnimation(new Animation({
        duration: mainTransitionData.duration, 
        timingFunction: "easeInOutQuad"
      }).on("progress", ( event ) => {
        var a = event.advancement;
        this.leaf.scene.position.lerpVectors(mainPosition, mainTransitionData.position, a);
        targetRotation.lerpVectors(mainRotation, mainTransitionData.rotation, a);
        this.leaf.scene.rotation.setFromVector3(targetRotation);
      }));
      
      ModelAnimationManager.play('move-in-wind').then(() => {
        ModelAnimationManager.play('idle');
      });
    });
  
  }

  initGUI(){
    // Silence is golden
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);
    if ( toRemove.includes("leaf") ){
      this.scene.humanScale.group.remove(this.leaf.scene);
    }

    if ( toRemove.includes("background") ){
      this.scene.humanScale.group.remove(this.background.objec3D);
    }
    super.hide(newStep);
  }
}
