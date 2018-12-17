import * as THREE from "three";
import Scale from "../Scale";
import AssetsManager from "../../../../services/assetsManager/AssetsManager";
import Earth from "./components/Earth";
import Flux from "./components/Flux";
import Zoning from "./components/Zoning";
import AnimationManager from "./../../../AnimationManager";
import Animation from "~/helpers/Animation";

class MacroScale extends Scale {
  
  /**
   * @constructor
   * @param {THREE.Scene} args.scene
   */
  constructor(args){
    super({...args, name: "macro"});
    this.state = {
      ...this.state
    }

    this.init();
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
    if( AssetsManager.loader.isLoaded("global") ) {
      this.initScene(AssetsManager.loader.getFiles("global"));
    }
    AssetsManager.loader.on("load:global", (event)=> this.initScene( event ))
  }

  /**
   * Init THREE.js part
   */
  initScene( assets ){
    this.earth = new Earth(assets, {
      radius: 2
    });

    let flux = new Flux(
      { lat: 4.757908, lon: -72.147105 },
      { lat: 48.862790, lon: 2.356302 },
      2, 0.3 + 0.1 * Math.random()
    );
      
    this.earth.group.add(flux.fluxObject);

    this.zonings = [];
    ["bolivie", "guyane", "france", "perou"].forEach(country => {
      var zoning = new Zoning(country); 
      this.earth.group.add(zoning.object);
      this.zonings.push(zoning);
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
  }
  
  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
    if( this.state.currentVisibility !== this.state.targetVisibility ){
      this.group.scale.x = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.y = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.z = 1 + (2 - this.state.currentVisibility*2);  
    }

    this.earth.group.rotation.y += 0.0005;

    if(this.earth && this.earth.clouds) {
      this.earth.clouds.rotation.y += 0.001;
    }
  }
}

export default MacroScale;
