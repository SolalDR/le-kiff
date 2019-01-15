import Molecule from "./components/Molecule";
import AssetsManager from "~/services/assetsManager/AssetsManager";
import Scale from "../Scale";
import Bus from "~/helpers/Bus";
import {guiMicro} from "~/services/gui"
import ColorPlane from "./../../../components/ColorPlane"
import {Brownian} from "noisadelic";

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
    this.noise = new Brownian({
      size: 1024,
      rgb: true,
      dynamic: true
    });
    
    this.init();
  }

  /**
   * @override
   * Init scale
   */
  init(){
    super.init();
    this.initScene(AssetsManager.loader.getFiles("global"));
  }
  
  display(previous, next){
    super.display( this.config.transitions.all );
  }

  hide(previous, next){
    super.hide( this.config.transitions.all );
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
    mat.material.envMap = env;
    mat.material.envMapIntensity = 2; 
    mat.material.metalness = 1;
    mat.material.roughness = 0.2;
    mat.material.transparent = true;
    mat.material.opacity = 1;
    mat.material.needsUpdate = true;
    // mat.material.color = new THREE.Color(0, 0, 0);
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
    var listFull = [ "cocaine", "kerosene", "chaux",  "eau",  "acide_sulfurique",  "ammoniac",  "permanganate de potassium",  "hydroxyde d'amonium",  "ether",  "acetone",  "acide_chloridrique", "bicarbonate_de_soude" ]

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
      
      if(this.config.molecules[molecule.name]){
        if( this.config.molecules[molecule.name].position ){
          molecule.object3D.position.copy(this.config.molecules[molecule.name].position)
        }
        if(this.config.molecules[molecule.name].rotation ){
          molecule.object3D.rotation.copy(this.config.molecules[molecule.name].rotation)
        }
      }

      this.group.add(molecule.object3D);
    })

    this.plane = new ColorPlane({
      gui: guiMicro
    });
    

    this.plane.position.z = -100;
    guiMicro.addObject3D("Plane", this.plane)
    this.group.add(this.plane);
    
    Bus.verbose("scale-micro:init", 2)
  }

  /**
   * @override
   * Raf
   */
  loop(){
    if (this.plane ) {
      this.plane.material.uniforms.u_time.value += 0.0005;
    }
    
    super.loop();
  }

}

export default MicroScale;
  