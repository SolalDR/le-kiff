import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import LeafCloud from "./../components/LeafCloud";
import config from "./config";
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import Configuration, { c } from "../../../../helpers/Configuration";
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
  init( previousStep ) {
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
    this.leaf = ressources.step_1_human_leaf.result;
    this.leaf.name = 'coca-plant';
    var main = ressources.step_1_human_leaf.result.scene;
    main.name = 'step_1_human_leaf';
    
    this.leafClouds = new LeafCloud({
      map: ressources.mapLeaf.result,
      alpha: ressources.alphaLeaf.result,
      normal: ressources.normalLeaf.result,
      roughness: ressources.roughnessLeaf.result,
      transparent: true
    });
    this.leafClouds.object3D.position.z = -10;
    this.leafClouds.object3D.material.opacity = 0;
    this.leafCloudsConfig = new Configuration(this.leafClouds.config);

    this.scene.humanScale.group.add(this.leafClouds.object3D);

    if (previousStep.background){
      this.background = previousStep.background;
      this.background.changeBackground(ressources.background2.result, 3000, 3000);
    }
  
    ModelAnimationManager.generateClips(this.leaf, config.modelAnimation.clips, config.modelAnimation.options);
    ModelAnimationManager.play('hang-out').then((e) => {
      var mainPosition = this.leaf.scene.position.clone();
      var mainRotation = this.leaf.scene.rotation.toVector3();
      var targetRotation = new THREE.Vector3()
      const mainTransitionData = config.transitions.find(u => u.object === this.leaf.scene.name); 
      
      AnimationManager.addAnimation(new Animation({
        duration: mainTransitionData.duration + 3500,
        timingFunction: "easeInOutQuad"
      }).on("progress", (event) => {
        // Leaf clouds anim
        if( event.advancement < 0.5 ){
          this.leafClouds.object3D.material.opacity = event.advancement*2;
        }
        this.leafClouds.config.speedRotation = 5 - 3 * event.advancement;
        this.leafClouds.config.amplitude = 10 + 20 * event.advancement;
        
        this.leafClouds.object3D.position.z = 0 - 15*event.advancement;
        this.leafClouds.object3D.position.x = -5 + event.advancement * 5;
        this.leafClouds.object3D.position.y = 15 - event.advancement * 15;
      }).on("end", () => {
        this.leafClouds.object3D.position.set(0, 0, -15);
        this.leafClouds.object3D.material.opacity = 1;
      }))

      
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
    
    this.initGUI();

  }

  initGUI(){
    if( !this.folder.leafCloud ) {
      this.folder.leafCloud = this.gui.addFolder("Leaf Cloud");
      this.folder.leafCloud.addMesh("Mesh", this.leafClouds.object3D);
      this.folder.leafCloud.add(this.leafClouds.config, "speedPosition")
      this.folder.leafCloud.add(this.leafClouds.config, "speedRotation")
      this.folder.leafCloud.add(this.leafClouds.config, "amplitude")
    }
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


  /**
   * @override
   * Raf
   */
  loop(time){
    this.leafClouds.render(time * 0.01);
    super.loop();
  }
}
