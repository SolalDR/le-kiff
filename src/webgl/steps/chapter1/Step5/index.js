import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import SimplexNoise from "simplex-noise";
import Renderer from "~/webgl/rendering/Renderer"
import { AnimationManager, Animation } from "../../../manager";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "sphere"]);
    this.simplex = new SimplexNoise();
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
    if( previousStep.rank === this.rank - 1 ){
      this.pasta = previousStep.pasta;
      this.water = previousStep.water;
      this.particleCloud = previousStep.particleCloud;
    }

    this.water.mesh.position.y = -10;
    this.water.material.uniforms.diffuse.value = new THREE.Color("rgb(128, 128, 128)");
    
    this.scene.humanScale.group.add(this.water.mesh);


    AnimationManager.addAnimation(
      new Animation({ duration: 4000, delay: 2000 })
        .on("progress", (event)=>{
          this.water.mesh.position.y = -10 + 8*event.advancement;
        })
        .on("end", ()=>{
          this.water.mesh.position.y = -2;
        }) 
    )

    this.scene.humanScale.group.add(this.pasta.scene);
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);

    if ( toRemove.includes("sphere") ){
      this.scene.humanScale.group.remove(this.main);
    }

    super.hide(newStep);
  }

  loop(time){
    this.water.render();
    this.particleCloud.render()

    this.pasta.render(time);

    super.loop();
  }
}
