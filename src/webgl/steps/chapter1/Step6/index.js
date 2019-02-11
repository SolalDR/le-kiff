import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import { AnimationManager, Animation } from "../../../manager";
import Pasta from "./../components/Pasta"
import SimplexNoise from "simplex-noise"

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "torus"]);
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
    super.beforeDisplay( ressources, previousStep );
    this.displayHumanScale( ressources, previousStep );
    super.display( ressources );
  }

  /**
   * Init human scale scene 
   * @param {*} event
   */
  displayHumanScale( ressources, previousStep ){
    // Get pasta
    if( previousStep.rank === this.rank - 1 ){
      this.pasta = previousStep.pasta;
    } else {
      this.pasta = new Pasta({
        object: ressources.step_4_pasta.result,
        noise: this.simplex
      })
    }

    // Get brick
    this.brick = ressources.step_6_plaquette.result;
    this.brick.scene.name = "step_6_brick";
    this.brickMaterial = this.brick.scene.children[0].material;

    // Morph group pasta/brick
    this.morphGroup = new THREE.Group();
    this.morphGroup.name = 'morph_group';
    this.morphGroup.rotation.set(0.38, 0.62, 0);

    // Brick transforms
    var brickStartScale = new THREE.Vector3(0.001, 0.001, 0.001);
    this.brick.scene.scale.copy(brickStartScale);
    this.brick.scene.position.set(0, 0.04, 0);

    // Hide brick
    this.brickMaterial.transparent = true;
    this.brickMaterial.opacity = 0;
    
    // Pasta state 
    this.pasta.noisePastaIntensity = 0;
    this.pasta.material.uniforms.u_base_color.value = new THREE.Color(1, 1, 1);

    // Pasta animation state merged
    this.pasta.modelAnimation.startAtClip('explode');
    this.pasta.state.animated = true;

    // Delay pasta morph
    setTimeout(() => {

      // Pasta explode
      this.pasta.modelAnimation.play("explode", {timeScale: 1}).then(()=>{
        //console.log(this.pasta);
      })

      // Brick appear
      var brickTargetScale = new THREE.Vector3(0.0088, 0.0088, 0.0088)
      AnimationManager.addAnimation(
        new Animation({ duration: 300, delay: 200, timingFunction: "easeInOutQuad" })
          .on("progress", (event)=>{ 
            this.brick.scene.scale.lerpVectors(brickStartScale, brickTargetScale, event.advancement);
            this.brickMaterial.opacity = event.advancement;
          })
          .on("end", ()=>{
            
          })
      )

    }, 3000)
  

    // add objects to group
    this.morphGroup.add(this.pasta.scene);
    this.morphGroup.add(this.brick.scene);

    // add objects to scene
    this.scene.humanScale.group.add(this.morphGroup);

    this.initGUI();
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);

    if ( toRemove.includes("torus") ){
      this.scene.humanScale.group.remove(this.main);
    }

    super.hide(newStep);
  }

  initGUI(){
    if( !this.gui ) return; 
    if(!this.folder.brick){
      this.folder.brick = this.gui.addObject3D('Brick',  this.brick.scene, false);
      this.folder.brick.addMaterial('Material', this.brickMaterial);         
    }
  }

  loop(time){
    this.pasta.render(time);
    super.loop();
  }
}
