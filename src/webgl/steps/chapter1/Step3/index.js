import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
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
      new THREE.BoxGeometry(),
      new THREE.MeshPhongMaterial({
        color: 0xFF0000
      })
    );
    this.main.name = "main-step-2"

    this.scene.humanScale.group.add(this.main);
  }

  display( isNextStep = false, event ) {
    this.initHumanScale( event );
    super.display();
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    super.hide();
  }
}
