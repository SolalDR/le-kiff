import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import FitPlane from "~/webgl/components/Scale/Human/components/FitPlane"

import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import config from "./config";
import { c } from "../../../../helpers/Configuration";
import { InteractivePlane } from "../../../components";
import AbilitiesManager from "~/services/AbilitiesManager";
import ModelAnimationManager from "../../../manager/ModelAnimation";
import LeafBack from "../components/LeafBack";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  constructor(params){
    super(params, [ "leaf", "background", "leafbacks" ]);
  }

  /**
   * This method initialize the step and 
   * @param {Step} previousStep previous step in History
   */
  init( previousStep = null ) {
    super.init(config, previousStep);
    this.display(previousStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  /**
   * Display the initialized step and launch human scale by default
   * @param {Step} previousStep 
   * @param {object} ressources 
   */
  display( previousStep = null, ressources ) {
    super.beforeDisplay( ressources, previousStep );
    this.displayHumanScale( ressources, previousStep );
    super.display( ressources );
  }

  displayHumanScale( ressources, previousStep ){
    
    this.background = new InteractivePlane({
      front: ressources.background1.result, 
      back: ressources.background2.result,
      size: 450,
      gui: this.gui
    });
    this.background.object3D.name = "background";
    this.background.object3D.position.z = -120;

    // Generate background leafs
    this.leafBacks = [];
    this.leafBackGroup = new THREE.Group();
    this.leafBacksConfig = config.leafBacks;
    this.leafBacksConfig.forEach((config, i) => {
      var leafBack = new LeafBack({
        name: 'leaf_back_' + i,
        texture: ressources.step_1_bg_leaf.result,
        position: config.position,
        rotation: config.rotation,
        scale: config.scale,
        color: config.color
      })  
      this.leafBacks.push(leafBack);
      this.leafBackGroup.add(leafBack.object3D);
    });

    this.leaf = ressources.step_1_human_leaf.result;
    this.leafScene = this.leaf.scene;
    this.leafSceneMaterial = this.leaf.scene.children[0].children[0].children[0].children[0].material
    this.leafScene.name = 'step_1_human_leaf_scene';
    var mainTransformConfig = config.transforms.find(transform => transform.asset === this.leafScene.name);
    this.leafScene.position.copy(mainTransformConfig.position);
    this.leafScene.rotation.copy(mainTransformConfig.rotation);
    

    // Idle Animation
    var modelAnimLeaf = ModelAnimationManager.generateClips(this.leaf, config.modelAnimation.clips, config.modelAnimation.options);
    modelAnimLeaf.play('wiggle-branch', {
      timeScale: 0.6, 
      loop: THREE.LoopRepeat
    });

    this.initGUI();
 
    // Add Objects to scene
    this.scene.humanScale.group.add(this.background.object3D);
    this.scene.humanScale.group.add(this.leafScene);
    this.scene.humanScale.group.add(this.leafBackGroup);

    AbilitiesManager.can("all", true);
  }

  initGUI(){
    if( !this.gui ) return;
    // add leaf folder if doesn't exist
    if(!this.folder.leaf){
      this.folder.leaf = this.gui.addObject3D("Leaf",  this.leaf.scene, false);
      this.folder.leaf.addMaterial('Leaf detached', this.leafSceneMaterial); 
      this.folder.leaf.addMaterial('Leaf', this.leaf.scene.children[0].children[1].material);  
    }

    if(!this.folder.background ){
      this.folder.background = this.gui.addFolder("Interactiv\e Plane");
      this.folder.background.add(this.background.object3D.material.uniforms.u_opacity, "value", 0, 1).name("Opacity");
      this.folder.background.addVector("offset front", this.background.object3D.material.uniforms.u_offset_front.value);
      this.folder.background.addVector("offset back", this.background.object3D.material.uniforms.u_offset_back.value);
    }

    if(!this.folder.leafBacks ){
      this.folder.leafBacks = this.gui.addFolder("Leaf Backs");
      this.leafBacks.forEach(leafBack => {
        var leafBackFolder = this.folder.leafBacks.addFolder(leafBack.name);  
        leafBackFolder.addObject3D("Mesh",  leafBack.object3D, false);
      })
    }

  }

  hide( newStep ) {
    var toRemove = this.getRemovableObject(newStep);

    if ( toRemove.includes("leaf") ){
      this.scene.humanScale.group.remove(this.leaf.scene);
    }

    if ( toRemove.includes("background") ){
      this.scene.humanScale.group.remove(this.background.object3D);
    }


    if ( toRemove.includes("leafbacks") ){
      this.scene.humanScale.group.remove(this.leafBackGroup);
    }
    
    super.hide(newStep);
  } 

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
  }
}
