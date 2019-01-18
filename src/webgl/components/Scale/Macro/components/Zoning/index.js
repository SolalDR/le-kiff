import {guiMacro} from "~/services/gui"
import ZoningGeometry from "./Geometry"
import {MeshLineMaterial} from 'three.meshline'
import AnimationManager, {Animation} from "~/webgl/manager/Animation"
import config from "./config";
import { c } from "../../../../../../helpers/Configuration";
import Renderer from "~/webgl/rendering/Renderer"

// Todo pass on config parent

var countries = { 
  ARG: new ZoningGeometry("argentine"),
  BOL: new ZoningGeometry("bolivie"),
  FRA: new ZoningGeometry("france"),
  GUF: new ZoningGeometry("guyane"),
  PER: new ZoningGeometry("perou"),
  COL: new ZoningGeometry("colombie")
};

class Zoning {

  /**
   * @constructor
   * @param {Proptype.Info} info 
   */
  constructor(info){
    if (!info.attachment && !info.attachment.countries) return null;
    this.id = info.id;
    this.group  = new THREE.Group();
    this.group.name = "zoning-" + info.id;
    this.group.visible = false;
    this.info = info;
    
    this.fillMaterial = Zoning.Material.clone();
    this.strokeMaterial = Zoning.LineMaterial.clone();

    info.attachment.countries.forEach(element => {
      if (countries[element]) {
        this.fillMesh = new THREE.Mesh( countries[element].fillGeometry, this.fillMaterial );
        this.strokeMesh = new THREE.Mesh( countries[element].strokeGeometry, this.strokeMaterial );
        this.group.add(this.fillMesh);
        this.group.add(this.strokeMesh);
        this.group.visible = false;
      }
    });
  }

  display(){
    this.group.visible = true;
    this.fillMaterial.opacity = 0;
    this.strokeMaterial.uniforms.opacity.value = 0;
    
    AnimationManager.addAnimation(new Animation({
      from: 1.2, 
      to: 1.01, 
      duration: 1000,
      timingFunction: "easeOutQuad"
    }).on("progress", (event)=>{
      this.group.scale.x = event.value;
      this.group.scale.y = event.value;
      this.group.scale.z = event.value;

      Renderer.setBloomThreshold(event.advancement*0.99);
      Renderer.setBloomIntensity(0.1 + 2.9*event.advancement);

      this.fillMaterial.opacity = event.advancement * 0.5;
      this.strokeMaterial.uniforms.opacity.value = event.advancement;
    }))
  }

  hide(){
    AnimationManager.addAnimation(new Animation({
      from: 1, 
      to: 0,
      duration: 1000, 
      timingFunction: "easeOutQuad"
    })
    .on("progress", (event)=>{  
      this.fillMaterial.opacity = event.value;
      this.strokeMaterial.uniforms.opacity.value = event.value;
    })
    .on("end", _ =>{
      this.group.scale.x = 1;
      this.group.scale.y = 1;
      this.group.scale.z = 1;

      this.fillMaterial.opacity = 0;
      this.strokeMaterial.uniforms.opacity.value = 0;

      this.group.visible = false;
    }));
    
  }
}

Zoning.Material = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  color: config.fill.color,
  opacity: config.opacity
});

Zoning.LineMaterial = new MeshLineMaterial({
  lineWidth: .01,
  dashOffset: 0,
  dashArray: 0,
  dashRatio: 0,
  transparent: true
})

export default Zoning;
