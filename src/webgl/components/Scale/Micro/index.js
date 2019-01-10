import Molecule from "./components/Molecule";
import AssetsManager from "~/services/assetsManager/AssetsManager";
import Scale from "../Scale";
import config from "./config";
import Bus from "~/helpers/Bus";
import {guiMicro} from "~/services/gui"

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
    super.display( config.transitions.all );
  }

  hide(previous, next){
    super.hide( config.transitions.all );
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
    var bondMaterial = this.initMoleculeMaterial(e.molecule.result.scene.children[3])
    var atomMaterial = bondMaterial.clone();

    guiMicro.addMaterial("Material liaison atom", bondMaterial);
    guiMicro.addMaterial("Material atom", atomMaterial);
    var list = ["cocaine", "kerosene"];

    var guiMolecule = guiMicro.addFolder("Molecules");

    list.forEach(item => {
      const molecule = new Molecule({
        name: item,
        pdb: e[item].result,
        bondMaterial, 
        atomMaterial
      });
      guiMolecule.addObject3D(molecule.name, molecule.object3D);
      this.molecules.set(item, molecule);
            
      if(config.molecules[molecule.name] && config.molecules[molecule.name].position ){
        molecule.object3D.position.copy(config.molecules[molecule.name].position)
      }

      this.group.add(molecule.object3D);
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
  