import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import SoundManager from "../../../../services/soundManager/SoundManager";
import SimplexNoise from "simplex-noise";
import Renderer from "~/webgl/rendering/Renderer"
import { AnimationManager, Animation } from "../../../manager";
import { Mixer } from "../../../manager/Animation";
import AbilitiesManager from "../../../../services/AbilitiesManager";

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
    super.beforeDisplay( ressources, previousStep );
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

    // play sound voiceover
    SoundManager.play('chapter_1_main_voice', 'step_5', {
      delay: 1
    })

    // Pasta
    this.pasta.noiseRocksIntensity = 0;

    // Water
    this.water.mesh.position.y = -10;
    this.water.mesh.material.uniforms.diffuse.value = new THREE.Color("rgb(128, 128, 128)");
    
    // Particle clouds
    this.particleCloud.object3D.material.uniforms.u_size.value = 0;
    this.particleCloud.config.speed = 20 * 0.00001;
    this.particleCloud.object3D.position.y = -20;
    this.particleCloud.material.uniforms.u_color.value = new THREE.Color("rgb(255,255,255)");

    this.scene.humanScale.group.add(this.water.mesh);
    this.scene.humanScale.group.add(this.particleCloud.object3D);

    // Wait and drop a water
    setTimeout(()=>{
      this.water.drop(0, -3, 0.3);
    }, 2600);

    // Start diving in water
    var fromAperture = Renderer.getBokehAperture();
    AnimationManager.addAnimation(
      new Animation({ duration: 2000, delay: 2000, timingFunction: "easeOutQuad" })
        .on("progress", (event)=>{
          this.water.mesh.position.y = -10 + 8*event.advancement;
          this.particleCloud.object3D.position.y = -20 + 17*event.advancement;
          this.particleCloud.object3D.material.uniforms.u_size.value = 5*event.advancement;
          if( event.advancement > 0.5 ){
            var a = (event.advancement - 0.5) * 2;
            Renderer.setBokehAperture(fromAperture + (4 - fromAperture)*a);
          }
        })
        .on("end", ()=>{
          this.water.mesh.position.y = -2;
          this.particleCloud.object3D.position.y = -3;
          Renderer.setBokehAperture(4);

          // explode pasta
          this.pasta.modelAnimation.currentAction.animation.time = this.pasta.modelAnimation.currentAction.animation.getClip().duration;
          this.pasta.modelAnimation.currentAction.animation.paused = false;

          this.pasta.state.animated = true;

          // particle speed
          var fromSpeed = this.particleCloud.config.speed
          AnimationManager.addAnimation(new Animation({duration: 4000})
            .on("progress", (event)=>{
              var a = event.advancement > 0.5 ? 1 - (event.advancement - 0.5)*2 : event.advancement*2
              this.particleCloud.config.speed = fromSpeed + ((20*0.00001) - 50*0.00001)*a
            })  
            .on("end", ()=>{
              this.particleCloud.config.speed = 20*0.00001;
            })
          )

          this.pasta.modelAnimation.play("main", {
            timeScale: -0.2
          }).then(()=>{
            // Reactivate noise  and animate diffuse
            this.pasta.state.animated = false;
            AnimationManager.addAnimation(new Animation({duration: 4000})
              .on("progress", (event)=>{
                this.pasta.material.uniforms.u_base_color.value = Mixer.color(new THREE.Color(0, 0, 0), new THREE.Color(1, 1, 1), event.advancement);
                this.pasta.noiseRocksIntensity = event.advancement*4;
              })  
              .on("end", ()=>{
                this.pasta.material.uniforms.u_base_color.value = new THREE.Color(1, 1, 1);
                this.pasta.noiseRocksIntensity = 4;

                // Out of water
                setTimeout(()=>{
                  AnimationManager.addAnimation(new Animation({duration: 4000, timingFunction: "easeOutQuad"})
                    .on("progress", (event)=>{
                      this.water.mesh.position.y = -2 - 15*event.advancement;
                      this.particleCloud.object3D.position.y = -3 - 17*event.advancement;
                      this.particleCloud.object3D.material.uniforms.u_size.value = 5*(1. - event.advancement);
                      this.pasta.noiseRocksIntensity = 4 - 4*event.advancement;
                      if( event.advancement > 0.5 ){
                        var a = (event.advancement - 0.5) * 2;
                        Renderer.setBokehAperture(4 - (4 - fromAperture)*a);
                      }
                    })
                    .on("end", ()=>{
                      AbilitiesManager.can("all", true);
                      this.water.mesh.position.y = -17;
                      this.particleCloud.object3D.position.y = -20;
                      this.pasta.noiseRocksIntensity = 0;
                      this.pasta.state.animated = true;
                      Renderer.setBokehAperture(fromAperture);
                      this.pasta.modelAnimation.play("main", {
                        timeScale: 0.4
                      });
                    })
                  )
                }, 6000)

              })
            )
          })
        }
      )
    )


    this.scene.humanScale.group.add(this.pasta.scene);
  }

  hide(newStep) {
    super.beforeHide( newStep );
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
