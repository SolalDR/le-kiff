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
    super(params, ["background"]);
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

    // Setup init state objects
    this.setupSceneObjects(ressources, previousStep);

    // Hydraulic
    this.pressAnimation(this.config.timecodes.press);

    // Mark reveal
    this.markRevealAnimation(this.config.timecodes.mark);
    
    // Mico wave
    this.microWavePhaseAnimation(this.config.timecodes.microWave);

    // add objects to group
    this.morphGroup.add(this.pasta.scene);
    this.morphGroup.add(this.brick.scene);

    // add objects to scene
    this.scene.humanScale.group.add(this.morphGroup);

    this.initGUI();
  }

  /**
   * Setup state and transforms for objects in scene
   * @param {*} ressources 
   * @param {*} previousStep 
   */
  setupSceneObjects(ressources, previousStep) {

    // Background
    if( previousStep.background ){
      this.background = previousStep.background;
      this.background.changeBackground(ressources.background6.result)
    }

    // Morph group pasta/brick
    this.morphGroupRotation = new THREE.Euler(0.40, 0.64, 0)
    this.morphGroup = new THREE.Group();
    this.morphGroup.name = 'morph_group';
    // Rotation animation
    AnimationManager.addAnimation(
      new Animation({ 
        duration: 2000, 
        timingFunction: "easeInOutQuad" 
      }).on("progress", (event)=>{ 
        var a = event.advancement;
        this.morphGroup.rotation.x = this.morphGroupRotation.x * a;
        this.morphGroup.rotation.y = this.morphGroupRotation.y * a;
      })
    )  


    // Brick transforms
    this.brickStartScale = new THREE.Vector3(0.0005, 0.0005, 0.0005);
    this.brickStartPosition = new THREE.Vector3(0, -0.18, -0.06);
    this.brickStartRotation = new THREE.Euler(Math.PI, 0, 0);
    this.brick.scene.scale.copy(this.brickStartScale);
    this.brick.scene.position.copy(this.brickStartPosition);
    this.brick.scene.rotation.copy(this.brickStartRotation);
    

    // Hide brick
    this.brickMaterial.transparent = true;
    this.brickMaterial.opacity = 1;
    
    // Pasta state 
    this.pasta.material.uniforms.u_base_color.value = new THREE.Color(1, 1, 1);

    // Pasta animation state merged
    this.chainPasta = true;
    if( previousStep.rank !== this.rank - 1 ){
      this.pasta.modelAnimation.startAtClip('explode');
      this.chainPasta = false;
      //this.pasta.modelAnimation.currentAction.animation.time = this.pasta.modelAnimation.currentAction.animation.getClip().duration;
      //this.pasta.modelAnimation.currentAction.animation.paused = false;
    }

  }

  /**
   * Hydraulic press phase animations
   * @param {*} timecode 
   */
  pressAnimation(timecode) {
       
    // Group press movement
    var pastaStartPosition = new THREE.Vector3(0, 0, 0);
    var pastaPositionResetDuration = 3000;
    AnimationManager.addAnimation(
      new Animation({ 
        duration: pastaPositionResetDuration, 
        delay: timecode - pastaPositionResetDuration,
        timingFunction: "easeInOutQuart"
      }).on("progress", (event) => {
        this.pasta.noisePastaIntensity = 2 - 2 * event.advancement;
        this.pasta.scene.position.lerp(pastaStartPosition, event.advancement );
      })
      .on("end", () => {

        // Press Sound
        SoundManager.play('chapter_1_trigger', 'step_6_01_presse_hydrau', {
          volume: 1
        });    
        SoundManager.play('chapter_1_trigger', 'step_6_02_h1_elle_est_pour_qui', {
          delay: 2
        }).then(() => {
          SoundManager.play('chapter_1_trigger', 'step_6_03_h2_che');
        });        

        // Group press movement
        AnimationManager.addAnimation(
          new Animation({ duration: 1000, from:0, to: -1, timingFunction: "easeInQuint" })
          .on("progress", (event)=>{ 
            this.morphGroup.position.y = event.value;
          })
          .on("end", ()=>{
            AnimationManager.addAnimation(
              new Animation({ duration: 800, from: -1, to: 0, timingFunction: "easeOutQuint" })
              .on("progress", (event)=>{ 
                this.morphGroup.position.y = event.value;
              })
            )
          })
        )

        // Morph Pasta to Brick
        setTimeout(() => {
          
          // Pasta explode
          this.pasta.state.animated = true;
          this.pasta.modelAnimation.play("explode", {timeScale: 0.9, chain: this.chainPasta})
        
          // Brick appear
          var brickTargetScale = new THREE.Vector3(0.0086, 0.0086, 0.0086)
          AnimationManager.addAnimation(
            new Animation({ duration: 400, delay: 150, timingFunction: "easeInOutQuad" })
              .on("progress", (event)=>{ 
                this.brick.scene.scale.lerpVectors(this.brickStartScale, brickTargetScale, event.advancement);
                this.brickMaterial.opacity = event.advancement*2 < 1 ? event.advancement*2 : 1;
              }).on("end", () => {
                this.morphGroup.remove(this.pasta.scene);
              })
          )   
        }, 400)            

      })
    );
  }

  /**
   * Reveal mark on brick
   * @param {*} timecode 
   */
  markRevealAnimation(timecode) {
    //var morpphGroupTargetRotation = new THREE.Euler(0.1, 0.8, 0);
    setTimeout(() => {
      AnimationManager.addAnimation(
        new Animation({ 
          duration: 2000, 
          timingFunction: "easeInOutQuad" 
        }).on("progress", (event)=>{ 
          var a = event.advancement;
          this.brick.scene.rotation.x = this.brickStartRotation.x * (1 - a);
        })
      )   
    }, timecode);
  }

  /**
   * Micro Wave Animation
   * @param {*} timecode 
   */
  microWavePhaseAnimation(timecode) {
    setTimeout(() => {
      // Roation animation
      AnimationManager.addAnimation(
        new Animation({ 
          duration: 7000, 
          from: 0, 
          to: Math.PI * 2,
          delay: 1000,
          timingFunction: "easeInOutQuad" 
        }).on("progress", (event)=>{ 
          this.morphGroup.rotation.y = this.morphGroupRotation.y + event.value;
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
      SoundManager.play('chapter_1_trigger', 'step_6_04_h1_mets_la_une_minute', {volume: 0.6});
      SoundManager.play('chapter_1_trigger', 'step_6_05_micro_onde', {
        volume: 0.6,
        delay: 2
      });

    }, timecode)
  }

  initGUI(){
    if( !this.gui ) return; 
    if(!this.folder.brick){
      this.folder.brick = this.gui.addObject3D('Brick',  this.brick.scene, false);
      this.folder.brick.addMaterial('Material', this.brickMaterial);         
    }
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);

    super.hide(newStep);
  }

  loop(time){
    this.pasta.render(time);
    super.loop();
  }
}
