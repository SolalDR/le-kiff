import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import { AnimationManager, Animation } from "../../../manager";
import Pasta from "./../components/Pasta"
import SimplexNoise from "simplex-noise"
import SoundManager from "../../../../services/soundManager/SoundManager";

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

    // Background
    this.background = previousStep.background;
    this.background.changeBackground(ressources.background6.result, 3000, 3000);

    // Morph group pasta/brick
    this.morphGroup = new THREE.Group();
    this.morphGroup.name = 'morph_group';
    this.morphGroup.rotation.set(0.38, 0.62, 0);

    // Brick transforms
    var brickStartScale = new THREE.Vector3(0.001, 0.001, 0.001);
    var brickStartPosition = new THREE.Vector3(0, 0.004, 0);
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

    // Hydraulic press phase
    setTimeout(() => {

      // Press Sound
      SoundManager.play('chapter_1_trigger', 'step_6_01_presse_hydrau', {
        volume: 1
      });    
      SoundManager.play('chapter_1_trigger', 'step_6_02_h1_elle_est_pour_qui', {
        delay: 2
      }).then(() => {
        SoundManager.play('chapter_1_trigger', 'step_6_03_h2_che');
      });
      
      // Press animation
      setTimeout(() => {
        // Pasta explode
        this.pasta.modelAnimation.play("explode", {timeScale: 1}).then(()=>{
          //console.log(this.pasta);
        })

        // Brick appear
        var brickTargetScale = new THREE.Vector3(0.0088, 0.0088, 0.0088)
        AnimationManager.addAnimation(
          new Animation({ duration: 300, delay: 150, timingFunction: "easeInOutQuad" })
            .on("progress", (event)=>{ 
              this.brick.scene.scale.lerpVectors(brickStartScale, brickTargetScale, event.advancement);
              this.brickMaterial.opacity = event.advancement;
            })
        )   

        // Group press movement
        AnimationManager.addAnimation(
          new Animation({ duration: 400, timingFunction: "easeInCubic" })
          .on("progress", (event)=>{ 
            //this.morphGroup.position.y = (- 1 + ( Math.cos(event.advancement * Math.PI * 2 ) + 1 ) / 2) / 2;
            this.morphGroup.position.y = -event.advancement * 0.5;
          })
          .on("end", ()=>{
            AnimationManager.addAnimation(
              new Animation({ duration: 700, timingFunction: "easeOutCubic" })
              .on("progress", (event)=>{ 
                //this.morphGroup.position.y = (- 1 + ( Math.cos(event.advancement * Math.PI * 2 ) + 1 ) / 2) / 2;
                this.morphGroup.position.y = event.advancement * 0.5;
              })
            )
          })
        )
      }, 300);

    }, this.config.timecodes.press)

    // Mico wave
    setTimeout(() => {
      // Roation animation
      AnimationManager.addAnimation(
        new Animation({ 
          duration: 6000, 
          from: 0, 
          to: Math.PI * 2,
          delay: 2000,
          timingFunction: "easeInOutQuad" 
        }).on("progress", (event)=>{ 
          this.morphGroup.rotation.y = 0.62 + event.value;
        })
        .on("end", ()=>{
          SoundManager.play('chapter_1_trigger', 'step_6_06_h1_snif_bon_comme_ca').then(() => {
            SoundManager.play('chapter_1_trigger', 'step_6_07_h1_bien_un_kilo').then(() => {
              SoundManager.play('chapter_1_trigger', 'step_6_08_h2_oui');
            });
          });
        })
      )   
      
      // Micro Wave sounds
      SoundManager.play('chapter_1_trigger', 'step_6_04_h1_mets_la_une_minute');
      SoundManager.play('chapter_1_trigger', 'step_6_05_micro_onde', {
        delay: 2
      });

    }, this.config.timecodes.microWave)
  

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
