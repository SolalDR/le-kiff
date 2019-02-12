import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import Water from "../../../components/Water";
import Renderer from "~/webgl/rendering/Renderer"
import ModelAnimationManager from "../../../manager/ModelAnimation";
import AnimationManager, {Animation} from "../../../manager/Animation";
import ParticleCloud from "~/webgl/components/ParticleCloud"
import configStep4 from "./../Step4/config"
import SoundManager from "../../../../services/soundManager/SoundManager";
import AbilitiesManager from "../../../../services/AbilitiesManager";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "leaf", "water", "leafCloud"]);
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
    this.leaf = ressources.step_1_human_leaf.result;
    this.leaf.name = config.modelAnimation.name;
    this.leafClouds = previousStep.leafClouds;
    
    this.water = Renderer.water;
    this.water.mesh.scale.x = 2;
    this.water.mesh.position.y = -15;
    this.water.mesh.position.z = 7;
    this.water.mesh.name = "water-step-3";
    this.water.drop(0, -5, 1)

    this.background = previousStep.background;
    this.particleCloud = new ParticleCloud({ gui: this.gui, config: this.config.particleConfig });
    this.scene.humanScale.group.add(this.particleCloud.object3D)

    this.initGUI();

    this.scene.humanScale.group.add(this.water.mesh)
    this.scene.humanScale.group.add(this.leaf.scene);

    // Generate sound clips
    var modelAnimLeaf = ModelAnimationManager.generateClips(this.leaf, config.modelAnimation.clips, config.modelAnimation.options)

    setTimeout(() => {
        SoundManager.play('chapter_1_trigger', 'step_3_02_feuille_decoupe');
        modelAnimLeaf.play('cut');
    }, this.config.timecodes.cut);


    setTimeout(()=>{
      this.water.drop(0, -5, 1);
      SoundManager.play('chapter_1_trigger', 'step_3_03_entree_eau');
      setTimeout(() => {
        SoundManager.addEffect('moogfilter');
        // TODO: update config effect to re-enable when going back from scale
        //this.config.transitions.all.sound.effect.list = ['moogfilter'];
        SoundManager.volume = 1;
        SoundManager.play('chapter_1_trigger', 'step_3_04_ambiance_eau');
      }, 500)
    }, this.config.timecodes.water + 300)

    // Leaf clouds fall and water rise, hide leaf
    var fromAperture = Renderer.getBokehAperture();
    var fromPosition = this.leaf.scene.position.y;
    var fromLightPosition = this.scene.lightPrimary.position.clone();
    var fromLightAmbientIntensity = this.scene.lightAmbient.intensity;
    AnimationManager.addAnimation(new Animation({
      duration: 1500,
      delay: this.config.timecodes.water,
      timingFunction: "easeOutQuad"
    }).on("progress", (event) => {
      this.leafClouds.object3D.position.y = - event.advancement*20;
      this.water.mesh.position.y = -15 + event.advancement*13;
      this.particleCloud.object3D.position.y = -15 + event.advancement * 10;
      this.leaf.scene.position.y = fromPosition - event.advancement*5

      this.scene.lightAmbient.intensity = fromLightAmbientIntensity - event.advancement
      this.scene.lightPrimary.position.copy(
        fromLightPosition
          .clone()
          .add(
            new THREE.Vector3(5, 15, 5)
              .sub(fromLightPosition)
              .multiplyScalar(event.advancement)
          )
      )

      Renderer.setBokehAperture(fromAperture + event.advancement * 4)
    }).on("end", (event)=>{
      this.scene.lightPrimary.position.copy(new THREE.Vector3(5, 15, 5))
      this.config.human.rendering.light.primary.position.copy(this.scene.lightPrimary.position)
      this.config.human.rendering.light.ambient.intensity = 0.5;
      this.config.human.rendering.bokeh.aperture = 4
      setTimeout(() => {
        SoundManager.play('chapter_1_trigger', 'step_3_05_h1_ajoute_le_kerosene', {
          volume: 0.5
        });
      }, 3500)
      
      this.scene.humanScale.group.remove(this.leaf.scene);

      // Hide leaf clouds
      var fromColor = this.water.material.uniforms.diffuse.value.clone();
      var toColor = configStep4.water.color;
      AnimationManager.addAnimation(
        new Animation({duration: 7000,delay: 5000,timingFunction: "easeOutQuad"})
          .on("progress", (event) => {
            this.leafClouds.object3D.position.y = -20 - event.advancement*20;
            this.leafClouds.object3D.material.opacity = 1 - event.advancement;
            this.water.material.uniforms.diffuse.value = new THREE.Color(
              fromColor.r + (toColor.r - fromColor.r)*event.advancement,
              fromColor.g + (toColor.g - fromColor.g)*event.advancement,
              fromColor.b + (toColor.b - fromColor.b)*event.advancement
            );
            this.particleCloud.material.uniforms.u_size.value = event.advancement * 7;
          })
          .on("end", (event)=>{
            AbilitiesManager.can("all", true);
            this.water.material.uniforms.diffuse.value = toColor;
            this.scene.humanScale.group.remove(this.leafClouds.object3D);
            this.scene.humanScale.group.add(this.particleCloud.object3D);

            SoundManager.play('chapter_1_trigger', 'step_3_07_h2_c_est_bon').then(() => {
              SoundManager.play('chapter_1_trigger', 'step_3_08_h1_on_est_bons').then(() => {
                SoundManager.play('chapter_1_trigger', 'step_3_10_h2_ok').then(() => {
                  SoundManager.play('chapter_1_trigger', 'step_3_11_draine');
                })
              })
            })
          })
      );
    }));

    // Leaf cloud disapear & replace
    AnimationManager.addAnimation(new Animation({
      duration: 750,
      delay: this.config.timecodes.water,
      timingFunction: "easeOutQuad"
    }).on("progress", (event)=>{
      this.leafClouds.object3D.material.opacity = 1. - event.advancement;
    }).on("end", ()=>{
      this.leafClouds.object3D.material.alphaMap = ressources.alphaWaterLeaf.result;
      this.leafClouds.object3D.material.opacity = 0;
      this.leafClouds.object3D.geometry.maxInstancedCount = 500;
      this.leafClouds.config.speedPosition = 5;

      AnimationManager.addAnimation(new Animation({
        duration: 500,
        timingFunction: "easeOutQuad"
      }).on("progress", (event)=>{
        this.leafClouds.object3D.material.opacity = event.advancement;
      }).on("end", ()=>{
        this.leafClouds.object3D.material.opacity = 1;
      }))
    }))

    // Change backgrouund 
    this.background.changeBackground(ressources.background3.result, 5000, this.config.timecodes.water)


  }


  initGUI(){
    if( !this.gui ) return; 
    if( !this.folder.water ){
      this.folder.water = this.gui.addFolder("Water");
      var a = { explode: () => { this.water.drop(Math.random(), Math.random(), Math.random()*0.5 + 0.5) } }

      this.folder.water.addMesh("Water mesh", this.water.mesh);
      this.folder.water.add(this.water.heightmapVariable.material.uniforms.mouseSize, "value", 0, 0.5).name("Size")
      this.folder.water.add(this.water.heightmapVariable.material.uniforms.viscosityConstant, "value", 0, 0.1).name("viscosityConstant")
      this.folder.water.add(this.water.heightmapVariable.material.uniforms.gravityConstant, "value", 0, 20).name("gravityConstant")
      this.folder.water.add(a, "explode");
      this.folder.water.add(this.water.mesh.material.uniforms.opacity, "value", 0, 1)
    }
  }

  hide(newStep) {
    var toRemove = this.getRemovableObject(newStep);

    if ( toRemove.includes("background") ){
      this.scene.humanScale.group.remove(this.background);
    }

    if ( toRemove.includes("water") ){
      this.scene.humanScale.group.remove(this.water.mesh);
    }

    if ( toRemove.includes("leaf") ){
      this.scene.humanScale.group.remove(this.leaf.scene);
    }

    if ( toRemove.includes("leafCloud") ){
      this.scene.humanScale.group.remove(this.leafClouds.object3D);
    }

    super.hide(newStep);
  }

  loop(time){
    super.loop();
    if(this.leafClouds) {
      this.leafClouds.render(time * 0.01);
    }
    if( this.particleCloud ) {
      this.particleCloud.render()
    }
    this.water.render();
  }
}
