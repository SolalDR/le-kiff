import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import Water from "../../../components/Water";
import Renderer from "~/webgl/rendering/Renderer"
import ModelAnimationManager from "../../../manager/ModelAnimation";

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
    // this.main = new THREE.Mesh(
    //   new THREE.BoxGeometry(),
    //   new THREE.MeshPhongMaterial({
    //     color: 0xFF0000
    //   })
    // );
    this.main = event.step_1_human_leaf.result.scene;
    this.mainRoot = event.step_1_human_leaf.result;
    this.mainRoot.name = config.modelAnimation.name;
    this.main.name = "main-step-3"

    this.water = new Water({
      renderer: Renderer.renderer
    });
    this.water.mesh.position.y = -5;
    this.water.mesh.position.z = 7;

    // this.waterGui = this.gui.addFolder("Water");


    this.waterGui = this.gui.addFolder("Water");
    var a = {
      explode: () => { this.water.drop(Math.random(), Math.random(), Math.random()*0.5 + 0.5) }
    }
    this.waterGui.addMesh("Water mesh", this.water.mesh);
    this.waterGui.add(this.water.heightmapVariable.material.uniforms.mouseSize, "value", 0, 0.5).name("Size")
    this.waterGui.add(this.water.heightmapVariable.material.uniforms.viscosityConstant, "value", 0, 0.1).name("viscosityConstant")
    this.waterGui.add(this.water.heightmapVariable.material.uniforms.gravityConstant, "value", 0, 20).name("gravityConstant")
    this.waterGui.add(a, "explode");
    this.waterGui.add(this.water.mesh.material.uniforms.opacity, "value", 0, 1)


    window.water = this.water

    this.main.name = "main-step-2"

    this.scene.humanScale.group.add(this.water.mesh)
    this.scene.humanScale.group.add(this.main);

    // create clips from current scene model anims
    ModelAnimationManager.generateClips(this.mainRoot, config.modelAnimation.clips, config.modelAnimation.options)
    ModelAnimationManager.play('cut');
  }

  display( isNextStep = false, event ) {
    this.displayHumanScale( event );
    super.display( event );
  }

  hide() {
    this.scene.humanScale.group.remove(this.main);
    this.scene.humanScale.group.remove(this.water.mesh)
    this.gui.remove(this.waterGui)
    super.hide();
  }

  loop(){
    super.loop();
    this.water.render();
  }
}
