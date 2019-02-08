import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import SoundManager from "../../../../services/soundManager/SoundManager";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "sphere"]);
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
    this.main = new THREE.Mesh( new THREE.SphereGeometry(1,16,16), new THREE.MeshPhongMaterial({ color: 0x00FF00 }) );
    this.main.name = "sphere";
    
    // play sound voiceover
    SoundManager.play('chapter_1_main_voice', 'step_5', {
      delay: 1
    })

    this.scene.humanScale.group.add(this.main);
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);

    if ( toRemove.includes("sphere") ){
      this.scene.humanScale.group.remove(this.main);
    }

    super.hide(newStep);
  }

  loop(){
    super.loop();
  }
}
