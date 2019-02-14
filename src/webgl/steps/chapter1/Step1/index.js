import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import FitPlane from "~/webgl/components/Scale/Human/components/FitPlane"

import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import config from "./config";
import { c } from "../../../../helpers/Configuration";
import { InteractivePlane } from "../../../components";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  constructor(params){
    super(params, [ "leaf", "background" ]);
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
    this.background.object3D.position.z = -100;
    // this.background.object3D.position.y = -10;


    this.leaf = ressources.step_1_human_leaf.result;
    var leafScene = this.leaf.scene;
    leafScene.name = 'step_1_human_leaf_scene';
    var mainTransformConfig = config.transforms.find(transform => transform.asset === leafScene.name);
    leafScene.position.copy(mainTransformConfig.position);
    leafScene.rotation.copy(mainTransformConfig.rotation);
    this.scene.humanScale.group.add(leafScene);
  
    //Leaf reveal 
    AnimationManager.addAnimation(new Animation({
      duration: 3000,
      timingFunction: "easeOutQuad",
      delay: 3000,
      from: mainTransformConfig.position.y,
      to: -1.18
    }).on("progress", (event) => {
      leafScene.position.y = event.value;
      this.background.object3D.position.y = -10 * (1 - event.advancement);
    }));

    // main transform

    this.initGUI();
 
    // Add background
    this.scene.humanScale.group.add(this.background.object3D);
    
  }

  initGUI(){
    if( !this.gui ) return;
    // add leaf folder if doesn't exist
    if(!this.folder.leaf){
      this.folder.leaf = this.gui.addObject3D("Leaf",  this.leaf.scene, false);
      this.folder.leaf.addMaterial('Leaf detached', this.leaf.scene.children[0].children[0].material); 
      this.folder.leaf.addMaterial('Leaf', this.leaf.scene.children[2].material);   
    }

    if(!this.folder.background ){
      this.folder.background = this.gui.addFolder("Interactiv\e Plane");
      this.folder.background.add(this.background.object3D.material.uniforms.u_opacity, "value", 0, 1).name("Opacity");
      this.folder.background.addVector("offset front", this.background.object3D.material.uniforms.u_offset_front.value);
      this.folder.background.addVector("offset back", this.background.object3D.material.uniforms.u_offset_back.value);
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
