import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import Water from "../../../components/Water";
import Renderer from "~/webgl/rendering/Renderer"
import SimplexNoise from "simplex-noise";
import configStep3 from "./../Step3/config";
import ParticleCloud from "~/webgl/components/ParticleCloud"
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import SoundManager from "../../../../services/soundManager/SoundManager";
import Pasta from "./../components/Pasta"
import AbilitiesManager from "../../../../services/AbilitiesManager";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "water"]);
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

    // Start sound effect
    if( previousStep.rank !== this.rank - 1){
      SoundManager.addEffect('moogfilter');
    }

    // Start sound
    SoundManager.play('chapter_1_trigger', 'step_4_01_h1_ajoute_ammoniac').then(() => {
      SoundManager.play('chapter_1_trigger', 'step_4_02_ajout_ammoniac').then(() => {
        SoundManager.play('chapter_1_trigger', 'step_4_03_h1_comme_ca_c_est_bien');
      });
    })
  

    // Water
    if( previousStep.water) {
      this.water = this.previousStep.water;
    } else {
      this.water = this.water = Renderer.water;
      this.water.mesh.position.y = -2;
      this.water.mesh.position.z = 7;
      this.water.mesh.scale.x = 2;
      this.water.material.uniforms.diffuse.value = this.config.water.color
      this.water.mesh.name = "water-step-3";
      this.scene.humanScale.group.add(this.water.mesh)
    }

    // Background
    if( previousStep.background ){
      this.background = previousStep.background;
    }
    if( previousStep.rank !== this.rank - 1){
      this.background.changeBackground(ressources.background3.result)
    }

    // Particle cloud
    if( previousStep.particleCloud ){
      this.particleCloud = previousStep.particleCloud;
    } else {
      this.particleCloud = new ParticleCloud({ gui: this.gui, config: configStep3.particleConfig });
      this.scene.humanScale.group.add(this.particleCloud.object3D);
      this.particleCloud.object3D.position.y = -5;
      this.particleCloud.material.uniforms.u_size.value = 7;
    }

    // Pasta Rock
    this.pasta = new Pasta({
      object: ressources.step_4_pasta.result,
      noise: this.simplex
    })
    this.pasta.noiseRocksIntensity = 3;
    this.scene.humanScale.group.add(this.pasta.scene);
  
    // Wait and rocks appear
    this.pastaRocksFinished = 0;
    this.background.changeBackground(ressources.background4.result, 3000, 2000)
    this.pasta.state.animated = false;
    this.pasta.rocks.forEach((rock, i) => {
      rock.scale.copy(new THREE.Vector3())
      AnimationManager.addAnimation(new Animation({ delay: 1500 + this.pasta.delays[i] * 2000,  timingFunction: "easeOutQuad", duration: 2000 })
        .on("progress", (event)=>{
          let scale = event.advancement/2;
          rock.scale.set(scale, scale, scale)
        })
        .on("end", ()=>{
          this.pastaRocksFinished++;
          if( this.pastaRocksFinished === this.pasta.rocks.length ){
            AnimationManager.addAnimation(new Animation({
              duration: 4000,
              timingFunction: "easeOutQuad"
            }).on("progress", (event) => {
              this.pasta.noiseRocksIntensity = 3 - 3*event.advancement
            }).on("end", ()=>{
              AbilitiesManager.can("all", true);
              this.pasta.state.animated = true;
              this.pasta.modelAnimation.play("merge", {
                timeScale: 0.4
              }).then(() => {
                // play sound main voice
                SoundManager.play('chapter_1_main_voice', 'step_4');
                // Update lights at animation end            
                this.config.human.rendering.light = this.config.human.rendering.air.light;
                this.scene.humanScale.updateRendering({animate: true});              
              })
              // play sound pasta merging
              SoundManager.play('chapter_1_trigger', 'step_4_04_merge_pasta', {
                delay: 0.4
              });

            }));
          }
        })  
      )
    })


    setTimeout(()=>{
      this.water.drop(0, -2.49, 0.15);
    }, 6500)

    var fromParticleSpeed = this.particleCloud.config.speed;
    var fromParticlePosition = this.particleCloud.object3D.position.y
    var fromParticleSize = this.particleCloud.material.uniforms.u_size.value;

    // Water disapear
    var waterSoundEffectRemoved = false;
    AnimationManager.addAnimation(new Animation({ duration: 8000, delay: 5000 })
      .on("progress", (event) => {
        this.water.mesh.position.y =  -2 -9*event.advancement;
        this.particleCloud.config.speed = fromParticleSpeed + 0.0001*event.advancement;
        this.particleCloud.object3D.position.y = fromParticlePosition - 10*event.advancement;
        this.particleCloud.material.uniforms.u_size.value = fromParticleSize - fromParticleSize*event.advancement;
        
        Renderer.setBokehFocus(THREE.Math.lerp(config.human.rendering.bokeh.focus, config.human.rendering.air.bokeh.focus, event.advancement));
        // remove underwater effect when
        if(event.advancement > 0.35 && !waterSoundEffectRemoved) {
          waterSoundEffectRemoved = true;
          SoundManager.removeAllEffects();
          SoundManager.setDefaultVolume();
        }
      })
      .on("end", () => {
        config.human.rendering.bokeh.focus = Renderer.getBokehFocus()
        this.scene.humanScale.group.remove(this.water.mesh);
        this.scene.humanScale.group.remove(this.particleCloud.object3D);
      })
    )
    
    this.initGUI();
    
  }


  initGUI(){
    if( !this.gui ) return; 
    if( !this.folder.water ){
      this.folder.water = this.gui.addFolder("Water");
      var a = { explode: () => { this.water.drop(0, -3, 0.2) } }

      this.folder.water.addMesh("Water mesh", this.water.mesh);
      this.folder.water.add(this.water.heightmapVariable.material.uniforms.mouseSize, "value", 0, 0.5).name("Size")
      this.folder.water.add(this.water.heightmapVariable.material.uniforms.viscosityConstant, "value", 0, 0.1).name("viscosityConstant")
      this.folder.water.add(this.water.heightmapVariable.material.uniforms.gravityConstant, "value", 0, 20).name("gravityConstant")
      this.folder.water.add(a, "explode");
      this.folder.water.add(this.water.mesh.material.uniforms.opacity, "value", 0, 1)
    }
    if(!this.folder.pasta){
      this.folder.pasta = this.gui.addObject3D("Pasta",  this.pasta.scene, false);
      this.folder.pasta.addMaterial('Pasta', this.pasta.scene.children[0].children[0].material);         
    }
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);
    if ( toRemove.includes("cube") ){
      this.scene.humanScale.group.remove(this.main);
    }

    if ( toRemove.includes("background") ){
      this.scene.humanScale.group.remove(this.background);
    }

    if ( toRemove.includes("water") ){
      this.scene.humanScale.group.remove(this.water.mesh);
    }

    super.hide(newStep);
  }

  /**
   * @override
   * Raf
   */
  loop(time){
    this.water.render();
    this.particleCloud.render()

    this.pasta.render(time);

    super.loop();
  }
}
