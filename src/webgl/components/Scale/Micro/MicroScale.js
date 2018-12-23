import Molecule from "./components/Molecule";
import AssetsManager from "../../../../services/assetsManager/AssetsManager";
import Scale from "../Scale";
import * as THREE from "three";

class MicroScale extends Scale {

  /**
   * @constructor
   * @param {THREE.Scene} args.scene
   * @param {THREE.Renderer} args.scene
   */
  constructor(args){
    super({...args, name: "micro"});
    this.state = {
      ...this.state
    }
    
    this.init();
  }

  /**
   * @override
   * Init scale
   */
  init(){
    super.init();
    if( AssetsManager.loader.isLoaded("micro") ) {
      this.initScene(AssetsManager.loader.getFiles("micro"));
    }
    AssetsManager.loader.on("load:micro", (event)=> this.initScene( event ));
  }
  
  /**
   * Init THREE.js part
   */
  initScene(e){

    var env = new THREE.CubeTextureLoader().setPath( '/images/molecule/ldr/' ).load( ['px.png','nx.png','py.png','ny.png','pz.png','nz.png' ] );
    e.molecule.result.scene.children[3].material.envMap = env; 
    e.molecule.result.scene.children[3].material.envMapIntensity = 2; 
    e.molecule.result.scene.children[3].material.metalness = 1;
    e.molecule.result.scene.children[3].material.roughness = 0.3;
    e.molecule.result.scene.children[3].material.transparent = true;
    e.molecule.result.scene.children[3].material.opacity = 0.85;

    e.molecule.result.scene.children[3].material.needsUpdate = true; 

    this.molecules = {
      cocaine: new Molecule({name: "cocaine", renderer: this.renderer, pdb: e.cocaine.result, material: e.molecule.result.scene.children[3].material}),
      kerosene: new Molecule({name: "kerosene", renderer: this.renderer, pdb: e.kerosene.result, material: e.molecule.result.scene.children[3].material}),
    }

    this.group.add(this.molecules.cocaine.object3D);  
    this.group.add(this.molecules.kerosene.object3D);  
  }

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
  }

}

export default MicroScale;
  