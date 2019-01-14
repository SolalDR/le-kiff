
import Scale from "../Scale";
import AssetsManager from "~/services/assetsManager/AssetsManager";
import Earth from "./components/Earth";
import Flux from "./components/Flux";
import Zoning from "./components/Zoning";
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import ConfigManager from "~/services/ConfigManager";
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
    this.config = ConfigManager.config.macro;
    this.init();
  }

  display(previous, next){
    const { cameraAnim } = super.display( this.config.transitions.all );
    cameraAnim
      .on("progress", ()=>{
        this.scene.camera.lookAt(new THREE.Vector3());  
      })
      .on("end", ()=>{
        this.scene.light.position.copy(new THREE.Vector3(2, 0, 7));
      })
  }

  hide(previous, next){
    console.log(this.config)
    super.hide( this.config.transitions.all );
  }


  updateScale(newScale, previousScale){
    super.updateScale(newScale, previousScale);

    if( newScale === this.name ){
      this.zonings.forEach(zoning => {
        AnimationManager.addAnimation(new Animation({
          from: 1.2, 
          to: 1.001, 
          duration: 500,
          delay: 2000 + Math.random() * 1000,
          timingFunction: "easeOutQuad"
        }).on("progress", (event)=>{
          zoning.object.scale.x = event.value;
          zoning.object.scale.y = event.value;
          zoning.object.scale.z = event.value;
          zoning.object.material.opacity = event.advancement/2;
        }))
      })
    } else {
      this.zonings.forEach(zoning => {
        AnimationManager.addAnimation(new Animation({
          from: 1, 
          to: 0,
          duration: 1000, 
          timingFunction: "easeOutQuad"
        }).on("progress", (event)=>{
          zoning.object.material.opacity = event.value;
        }).on("end", (event)=>{
          zoning.object.scale.x = 1;
          zoning.object.scale.y = 1;
          zoning.object.scale.z = 1;
          zoning.object.material.opacity = 0;
        }))
      })

    }
  }

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
      zoning.display();
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
    if( !this.earth ) return;
    super.loop();

    if(this.earth && this.earth.clouds) {
      this.earth.clouds.rotation.y += 0.001;
    }
  }
}

export default MacroScale;
