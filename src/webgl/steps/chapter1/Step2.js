import Step from "./../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import FitPlane from "~/webgl/components/Scale/Human/components/FitPlane"
import gui from "~/services/gui";
import * as THREE from "three";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {

  /**
   * This method initialize the step and 
   * @param {boolean} isNextStep If the step is arriving form the precedent
   */
  init( isNextStep ) {
    super.init();
    if( AssetsManager.loader.isLoaded("chapter-1") ) {
      this.display(isNextStep, AssetsManager.loader.getFiles("chapter-1"));
    }
    AssetsManager.loader.once("load:chapter-1", (event) => this.display( isNextStep, event ))
  }

  /**
   * Init human scale scene 
   * @param {*} event
   */
  initHumanScale( event ){
    var mainObject = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xFF0000
      })
    );
    var object = this.scene.humanScale.group;
    object.add(mainObject);

    var background = new FitPlane({
      background: event.step_1_background.result, 
      size: 450,
      distance: 100
    });

    mainObject.scale.y = 1;
    mainObject.position.x = -1;
    mainObject.position.y = -4.5;
    mainObject.rotation.z = 0.2;
    gui.addObject3D("Leaf",  mainObject, false);
    
    object.add(background.object3D);
  }

  display( isNextStep = false, event ) {
    this.scene.macroScale.updateFromStep(this);
    this.scene.microScale.updateFromStep(this);
    this.initHumanScale( event );
    super.display();
  }

  hide() {
    super.hide();
    gui.removeFolder("Leaf");
  }
}
