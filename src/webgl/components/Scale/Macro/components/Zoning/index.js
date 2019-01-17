import {guiMacro} from "~/services/gui"
import ZoningGeometry from "./Geometry"
import {MeshLineMaterial} from 'three.meshline'

import config from "./config";

var countries = { 
  ARG: new ZoningGeometry("argentine"),
  BOL: new ZoningGeometry("bolivie"),
  FRA: new ZoningGeometry("france"),
  GUF: new ZoningGeometry("guyane"),
  PER: new ZoningGeometry("perou")
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
    info.attachment.countries.forEach(element => {
      if (countries[element]) {
        this.group.add(new THREE.Mesh( countries[element].fillGeometry, Zoning.Material ));
        this.group.add(new THREE.Mesh( countries[element].strokeGeometry, Zoning.LineMaterial ));
      }
    });
  }

  display(){
    this.group.visible = true;
  }

  hide(){
    this.group.visible = false;
  }
}

Zoning.Material = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  color: config.color,
  opacity: config.opacity
});

Zoning.LineMaterial = new MeshLineMaterial({
  lineWidth: .1,
  dashOffset: 0,
  dashArray: 0,
  dashRatio: 0,
  transparent: true
})

var fillGui = guiMacro.addMaterial("Zoning Fill", Zoning.Material);
fillGui.add(Zoning.Material, "opacity", 0, 1).onChange(()=>{
  Zoning.Material.needsUpdate = true;
})
var strokeGui = guiMacro.addFolder("Zoning Stroke");
strokeGui.add(Zoning.LineMaterial.uniforms.lineWidth, "value", 0, 0.1).name("lineWidth")
strokeGui.add(Zoning.LineMaterial.uniforms.opacity, "value", 0, 1).name("opacity")
strokeGui.addThreeColor(Zoning.LineMaterial.uniforms.color, "value").name("Color")


export default Zoning;
