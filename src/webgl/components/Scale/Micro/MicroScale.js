import Molecule from "./components/Molecule";
import AssetsManager from "../../../../services/assetsManager/AssetsManager";
import Scale from "../Scale";
import * as THREE from "three";
import { microConfig } from "~/webgl/config";
import Bus from "~/helpers/Bus";

class MicroScale extends Scale {

  /**
   * @constructor
   * @param {THREE.Scene} args.scene
   * @param {THREE.Renderer} args.scene
   */
  constructor(args){
    super({...args, name: "micro"});
    this.molecules = new Map();

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
  
  display(previous, next){
    super.display( microConfig.transitions.all );
  }

  hide(previous, next){
    super.hide( microConfig.transitions.all );
  }

  // TODO Function updateFromStep
  updateFromStep( step ){
    var infos = step.infos.filter(info => info.scale === "micro" && info.type === "molecule");

    this.molecules.forEach(molecule => {
      var info = infos.find(info => info.slug === molecule.name);
      if( info ){
        molecule.attach(info);
      } else {
        molecule.detach();
      }
    })
    
    Bus.verbose("step:micro-update", 2)
  }

  initMoleculeMaterial(mat){
    var env = new THREE.CubeTextureLoader().setPath( '/images/molecule/ldr/' ).load( ['px.png','nx.png','py.png','ny.png','pz.png','nz.png' ] );
    mat.envMap = env;
    mat.envMapIntensity = 2; 
    mat.metalness = 1;
    mat.roughness = 0.3;
    mat.transparent = true;
    mat.opacity = 0.85;
    mat.needsUpdate = true;
    return mat.material; 
  }

  /**
   * Init THREE.js part
   */
  initScene(e){
    var material = this.initMoleculeMaterial(e.molecule.result.scene.children[3])

    var list = ["cocaine", "kerosene"];

    list.forEach(item => {
      this.molecules.set(item, new Molecule({
        name: item,
        pdb: e[item].result,
        material
      }));
      this.group.add(this.molecules.get(item).object3D);
    })
    
  
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
  