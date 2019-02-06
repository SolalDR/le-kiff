import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "cube"]);
  }
  /**
   * This method initialize the step and 
   * @param {Step} previousStep previous step in History
   */
  init( previousStep ) {
    super.init(config, previousStep);
    this.display(previousStep, AssetsManager.loader.getFiles("chapter-1"));
  }

  display( previousStep = null, ressources ) {
    this.displayHumanScale( ressources, previousStep );
    super.display( ressources );
  }

  /**
   * Init human scale scene 
   * @param {*} event
   */
  displayHumanScale( ressources, previousStep ){
    this.main = new THREE.Mesh( new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0xFF0000 }) );
    this.main.name = "cube";
  
    this.scene.humanScale.group.add(this.main);
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);

    if ( toRemove.includes("cube") ){
      this.scene.humanScale.group.remove(this.main);
    }

    super.hide(newStep);
  }

  loop(){
    super.loop();
  }
}
