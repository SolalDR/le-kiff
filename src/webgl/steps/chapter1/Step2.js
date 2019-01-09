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
    this.main = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0xFF0000
      })
    );
    this.main.name = "main-step-2"

    this.scene.humanScale.group.add(this.main);
  }

  display( isNextStep = false, event ) {
    // this.scene.macroScale.updateFromStep(this);
    // this.scene.microScale.updateFromStep(this);
    this.initHumanScale( event );
    super.display();
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    super.hide();
  }
}
