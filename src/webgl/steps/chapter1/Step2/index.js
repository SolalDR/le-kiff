import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import SoundManager from "~/webgl/components/SoundManager/SoundManager"

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

  display( isNextStep = false, event ) {
<<<<<<< HEAD
    this.displayHumanScale( event );
=======
    this.initHumanScale( event );


    const soundsData = [
        {
          name : event.step_2_main_sound.name, 
          sound : event.step_2_main_sound.result,
          options : {
            volume: 0.9
          }
        }
      ]
    SoundManager.add(soundsData)
    SoundManager.play(soundsData.map(data => data.name));

>>>>>>> update sounds when changing step + refacto
    super.display();
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    SoundManager.stop('step_2_main_sound', true);
    super.hide();
  }
}
