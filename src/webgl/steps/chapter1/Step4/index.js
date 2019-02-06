import Step from "./../../Step";
import AssetsManager from "~/services/assetsManager/AssetsManager"
import config from "./config";
import Water from "../../../components/Water";
import Renderer from "~/webgl/rendering/Renderer"
import ModelAnimationManager from "../../../manager/ModelAnimation";
import SimplexNoise from "simplex-noise";

/**
 * @constructor
 * @param {int} id
 */
export default class extends Step {
  constructor(params){
    super(params, ["background", "water"]);
    this.pastaRocks = [];
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

    // Water
    if(this.previousStep.water) {
      this.water = this.previousStep.water;
    } else {
      this.water = new Water({ renderer: Renderer.renderer });
      this.water.mesh.position.y = -3;
      this.water.mesh.position.z = 7;
      this.water.mesh.name = "water-step-3";
    }

    this.scene.humanScale.group.add(this.water.mesh)

    // Pasta Rock
    this.pasta = ressources.step_4_pasta.result;
    this.pasta.name = config.modelAnimation.name;
    this.pasta.scene.name = config.modelAnimation.name + '_scene';
    this.pasta.scene.scale.set(2.4,2.4, 2.4);
    this.pasta.scene.position.z = 1.32;

    this.scene.humanScale.group.add(this.pasta.scene);

    this.pastaRocks = this.pasta.scene.children[0].children;
    this.pastaRocksPositions = this.pastaRocks.map(rock => rock.position.clone());
    this.pastaRocksRotations = this.pastaRocks.map(rock => rock.rotation.clone());

    ModelAnimationManager.generateClips(this.pasta, config.modelAnimation.clips, config.modelAnimation.options);
    //ModelAnimationManager.play('main');
    this.initGUI();
    
  }


  initGUI(){
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

    for (let i = 0; i < this.pastaRocks.length; i++) {
      const rock = this.pastaRocks[i];
      const position = this.pastaRocksPositions[i];
      const rotation = this.pastaRocksRotations[i];
      rock.position.x = position.x + this.simplex.noise2D(position.x, time*0.2);
      rock.position.y = position.y + this.simplex.noise2D(position.y, time*0.2);
      rock.position.z = position.z + this.simplex.noise2D(position.z, time*0.2);
      rock.rotation.x = rotation.x + this.simplex.noise2D(rotation.y, time*0.05);
      rock.rotation.y = rotation.y + this.simplex.noise2D(rotation.y, time*0.05);
    };
    
    super.loop();
  }
}
