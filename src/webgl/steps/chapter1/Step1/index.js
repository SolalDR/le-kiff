import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import FitPlane from "~/webgl/components/Scale/Human/components/FitPlane"
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
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( previousStep ) {
    super.init(config);
    this.display(previousStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  /**
   * Display the initialized step and launch human scale by default
   * @param {bool} isNextStep 
   * @param {object} ressources 
   */
  display( isNextStep = false, ressources ) {
    this.displayHumanScale( ressources );
    super.display( ressources );
  }

  displayHumanScale( ressources ){
    
    this.background = new InteractivePlane({
      front: ressources.background1.result, 
      back: ressources.background2.result,
      size: 450,
      gui: this.gui
    });
    this.background.object3D.name = "background";
    this.background.object3D.position.z = -100;


    this.leaf = ressources.step_1_human_leaf.result;
    var main = this.leaf.scene;
    main.name = "main-step-1";
    main.scale.y = 1;
    main.position.set(-0.98, -1.18, -1.12);
    main.rotation.set(-0.16, 0.1, -0.38);
    this.scene.humanScale.group.add(main);
  

    // main transform

    this.initGUI();
 
    // Add background
    this.scene.humanScale.group.add(this.background.object3D);
    
  }

  initGUI(){
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
