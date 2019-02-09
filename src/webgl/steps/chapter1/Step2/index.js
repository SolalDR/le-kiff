import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import LeafCloud from "../components/LeafCloud";
import config from "./config";
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import leafCloudConfig from "./../components/LeafCloud/config";
import ModelAnimationManager from "../../../manager/ModelAnimation";
import SoundManager from "../../../../services/soundManager/SoundManager";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["leaf", "background", "leafCloud"]);
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
    this.leaf = previousStep.leaf || ressources.step_1_human_leaf.result;
    this.leaf.name = config.modelAnimation.name;
    
    // Background
    this.background = previousStep.background;
    this.background.changeBackground(ressources.background2.result, 3000, 3000);

    // Leaf cloud creation
    this.leafClouds = new LeafCloud({
      map: ressources.mapLeaf.result,
      alpha: ressources.alphaLeaf.result,
      normal: ressources.normalLeaf.result,
      roughness: ressources.roughnessLeaf.result,
      transparent: true,
      geometry: ressources.singleLeaf.result.children[0].geometry
    });
    this.leafClouds.object3D.position.z = leafCloudConfig.hidden.position.z;
    this.leafClouds.object3D.material.opacity = 0;
    this.scene.humanScale.group.add(this.leafClouds.object3D);

    // Animation leaf
    var modelAnimLeaf = ModelAnimationManager.generateClips(this.leaf, config.modelAnimation.clips, config.modelAnimation.options);
    modelAnimLeaf.play('hang-out', {timeScale: 1, delay: 0}).then((e) => {

      var mainPosition = this.leaf.scene.position.clone();
      var mainRotation = this.leaf.scene.rotation.toVector3();
      var targetRotation = new THREE.Vector3()
      const mainTransitionData = config.transitions.find(u => u.object === this.leaf.scene.name); 
      
      AnimationManager.addAnimation(new Animation({
        duration: mainTransitionData.duration + 2000,
        timingFunction: "easeInOutQuad"
      }).on("progress", (event) => {

        this.leafClouds.object3D.material.opacity = event.advancement;
        this.leafClouds.config.speedRotation = 5 - 3 * event.advancement;
        this.leafClouds.config.amplitude = 10 + 20 * event.advancement;
        
        this.leafClouds.object3D.position.x = -10 + event.advancement * 10;
        this.leafClouds.object3D.position.y = 11 - event.advancement * 11;

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
      
      modelAnimLeaf.play('move-in-wind', {
        timeScale: 1, 
        chain: true
      }).then(() => {
        modelAnimLeaf.play('idle', {
          timeScale: 0.2, 
          loop: THREE.LoopRepeat,
          chain: true
        });
      });
    });

    // Sounds
    setTimeout(() => {
      SoundManager.play('chapter_1_trigger', 'step_2_02_h1_aie_ca_fait_mal').then(() => {
        SoundManager.play('chapter_1_trigger', 'step_2_03_h1_celle_la_est_belle').then(() => {
          SoundManager.play('chapter_1_main_voice', 'step_2');
        });
      });
    }, 500)


    
    this.initGUI();

  }

  initGUI(){
    if( !this.gui ) return; 
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

    if ( toRemove.includes("leafCloud") ){
      this.scene.humanScale.group.remove(this.leafClouds.object3D);
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
