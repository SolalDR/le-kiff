import Scale from "../Scale";
import AssetsManager from "~/services/assetsManager/AssetsManager";
import Earth from "./components/Earth";
import Flux from "./components/Flux";
import Zoning from "./components/Zoning";
import Bus from "~/helpers/Bus";


class MacroScale extends Scale {
  
  /**
   * @constructor
   * @param {Scene} args.scene
   */
  constructor(args){
    super({...args, name: "macro"});
    this.state = {
      ...this.state
    }

    this.zonings = new Map();
    this.fluxs = new Map();
    this.init();
  }

  /**
   * @extends Scale.initEvents
   */
  initEvents(){
    super.initEvents();

    Bus.on("info:open-macro-zoning", (event)=>{
      var zoning = this.zonings.get(event.info.id);
      if( zoning ){
        zoning.display();
      }
    })

    Bus.on("info:close-macro-zoning", (event)=>{
      var zoning = this.zonings.get(event.info.id);
      if( zoning ){
        zoning.hide();
      }
    })
  }

  display(previous, next){    
    const { cameraAnim } = super.display( this.config.transitions.all );
    cameraAnim.on("progress", ()=>{
      this.scene.camera.lookAt(new THREE.Vector3());  
    });
  }

  hide(previous, next){
    super.hide( this.config.transitions.all );
  }

  onDisplay(event){
    super.onDisplay(event)
  }

  /**
   * Implement
   */
  onHide(){}

  /**
   * @override
   * Init scale
   */
  init(){
    super.init();
    this.initScene(AssetsManager.loader.getFiles("global"));
  }

  /**
   * Init THREE.js part
   */
  initScene( assets ){
    this.earth = new Earth(assets, {
      radius: 2
    });

    this.group.add(this.earth.group);

    var sky = new THREE.Mesh(
      new THREE.SphereBufferGeometry(100, 8, 8),
      new THREE.MeshBasicMaterial({
        map: assets.sky.result, 
        side: THREE.BackSide
      })
    );
    
    sky.name = "sky";
    this.group.add(sky);
    Bus.verbose("scale-macro:init", 2)
  }

  updateZoningInfos(infos){
    this.zonings.forEach((_, id) => {
      if (!infos.find(info => info.id === id)) {
        this.zonings.get(id).hide();
      }
    });

    infos.forEach(info => {
      var zoning = this.zonings.get(info.id);
      if (!zoning) {
        zoning = new Zoning(info, this.config);
        this.earth.globe.add(zoning.group);
        this.zonings.set(info.id, zoning);
      }
    });
  }

  updateFluxInfos(infos){
    this.fluxs.forEach((_, id) => {
      if (!infos.find(info => info.id === id)) {
        this.fluxs.get(id).hide();
      }
    });

    infos.forEach(info => {
      var flux = this.fluxs.get(info.id);
      if (!flux) {
        flux = new Flux(info);
        this.earth.globe.add(flux.group);
        this.fluxs.set(info.id, flux);
      }
      flux.display();
    });
  }

  /**
   * trigger when a new steps arrived
   * @param {[Step]} step
   */
  updateFromStep(step){
    var infos = step.infos.filter(info => info.scale === "macro");

    var zoningInfos = infos.filter(info => {
      if( info.attachment && info.attachment.type === "zoning" ) return true;
    });

    var fluxInfos = infos.filter(info => {
      if( info.attachment && info.attachment.type === "flux" ) return true;
    });

    
    this.updateZoningInfos(zoningInfos);
    this.updateFluxInfos(fluxInfos);
  }
  
  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
    Flux.LineMaterial.uniforms.dashOffset.value -= this.config.flux.dashOffsetSpeed;
    this.earth.clouds.rotation.y += 0.0001;
  }
}

export default MacroScale;
