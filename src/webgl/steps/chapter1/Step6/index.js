import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "torus"]);
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
    super.beforeDisplay( ressources, previousStep );
    this.displayHumanScale( ressources, previousStep );
    super.display( ressources );
  }

  /**
   * Init human scale scene 
   * @param {*} event
   */
  displayHumanScale( ressources, previousStep ){
    this.main = new THREE.Mesh( new THREE.TorusGeometry(1, 0.5, 16, 100), new THREE.MeshPhongMaterial({ color: 0x0000ff }) );
    this.main.name = "torus";
  
    this.scene.humanScale.group.add(this.main);
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);

    if ( toRemove.includes("torus") ){
      this.scene.humanScale.group.remove(this.main);
    }

    super.hide(newStep);
  }

  loop(){
    super.loop();
  }
}
