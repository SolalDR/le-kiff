import Molecule from "./components/Molecule";
import AssetsManager from "../../../../services/assetsManager/AssetsManager";
import Scale from "../Scale";

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
    this.molecules = {
      cocaine: new Molecule({name: "cocaine", renderer: this.renderer, pdb: e.cocaine.result}),
      kerosene: new Molecule({name: "kerosene", renderer: this.renderer, pdb: e.kerosene.result}),
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
    this.group.scale.x = this.state.currentVisibility;
    this.group.scale.y = this.state.currentVisibility;
    this.group.scale.z = this.state.currentVisibility;
  }

}

export default MicroScale;
  