import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import SoundManager from "~/services/soundManager/SoundManager";
import config from "./config";

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
    this.main = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0xFF0000
      })
    );
    this.main.name = "main-step-2"

    this.scene.humanScale.group.add(this.main);
  }

  display( isNextStep = false, event ) {
    this.displayHumanScale( event );
    super.display( event );
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    super.hide();
  }
}
