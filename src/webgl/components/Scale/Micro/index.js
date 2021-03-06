import Molecule from "./components/Molecule";
import AssetsManager from "~/services/assetsManager/AssetsManager";
import Scale from "../Scale";
import Bus from "~/helpers/Bus";
import {guiMicro} from "~/services/gui"
import {ColorPlane, ParticleCloud} from "./../../../components";
import {Brownian} from "noisadelic";
import SimplexNoise from "simplex-noise";

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

    this.simplex = new SimplexNoise();

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

  // TODO Function updateFromStep in Scale 
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

    if( this.initialized ){
      this.onUpdateConfig();
    }
  }

  onUpdateConfig() {
    this.updateMoleculesMaterial();
  }

  updateMoleculesMaterial(){
    this.atomMaterial.color = this.config.atomMaterial.color;
    this.atomMaterial.emissive = this.config.atomMaterial.emissive;
    this.atomMaterial.envMapIntensity = this.config.atomMaterial.envMapIntensity; 
    this.atomMaterial.needsUpdate = true;

    this.bondMaterial.color = this.config.bondMaterial.color;
    this.bondMaterial.emissive = this.config.bondMaterial.emissive;
    this.bondMaterial.envMapIntensity = this.config.bondMaterial.envMapIntensity; 
    this.bondMaterial.needsUpdate = true;
  }

  initMoleculeMaterial(mat){
    var env = new THREE.CubeTextureLoader().setPath( '/images/molecule/ldr/' ).load( ['px.png','nx.png','py.png','ny.png','pz.png','nz.png' ] );
    mat.material.envMap = env;
    mat.material.transparent = true;
    mat.material.opacity = 1;
    mat.material.needsUpdate = true;
    mat.material.roughness = 0.2;
    mat.material.metalness = 1;
    return mat.material;
  }

  /**
   * Init THREE.js part
   */
  initScene(e){
    this.bondMaterial = this.initMoleculeMaterial(e.molecule.result.scene.children[3])
    this.atomMaterial = this.bondMaterial.clone();
    this.updateMoleculesMaterial();

    // Molecules
    this.moleculesGroup = new THREE.Group();
    guiMicro.addMaterial("Material liaison atom", this.bondMaterial);
    guiMicro.addMaterial("Material atom", this.atomMaterial);
    var list = ["cocaine", "kerosene"];
    var listFull = [ "cocaine", "kerosene", "chaux",  "eau",  "acide_sulfurique",  "ammoniac",  "permanganate de potassium",  "hydroxyde d'amonium",  "ether",  "acetone",  "acide_chloridrique", "bicarbonate_de_soude" ]
    var guiMolecule = guiMicro.addFolder("Molecules");
    list.forEach(item => {
      const molecule = new Molecule({
        name: item,
        pdb: e[item].result,
        bondMaterial: this.bondMaterial,
        atomMaterial: this.atomMaterial
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

      this.moleculesGroup.add(molecule.object3D)
      
    })
    this.group.add(this.moleculesGroup);

    // Color plane
    this.plane = new ColorPlane({ gui: guiMicro, config: this.config.colorPlane });
    this.plane.position.z = -100;
    guiMicro.addObject3D("Plane", this.plane)
    this.group.add(this.plane);

    // Clouds
    this.clouds = new ParticleCloud({gui: guiMicro});
    this.group.add(this.clouds.object3D);

    Bus.verbose("scale-micro:init", 2)
  }

  /**
   * @override
   * Raf
   */
  loop(time){
    if (this.plane ) {
      this.plane.material.uniforms.u_time.value += 0.0005;
      this.clouds.render();
    }

    this.moleculesGroup.children.forEach(molecule => {
      var position = this.config.molecules[molecule.name].position; 
      molecule.position.x = this.simplex.noise2D(position.x, time*0.0001);
      molecule.position.y = this.simplex.noise2D(position.y, time*0.0001);
      molecule.rotation.z = this.simplex.noise2D(position.x, time*0.0001);
      molecule.rotation.y = this.simplex.noise2D(position.y, time*0.0001);
    });
    
    super.loop();
  }

}

export default MicroScale;
  