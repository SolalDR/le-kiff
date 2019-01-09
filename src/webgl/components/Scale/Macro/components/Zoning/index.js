import * as THREE from "three";
import ZoningGeometry from "./Geometry"

var countries = { 
  ARG: new ZoningGeometry("argentine"), 
  BOL: new ZoningGeometry("bolivie"), 
  FRA: new ZoningGeometry("france"), 
  GUF: new ZoningGeometry("guyane"),  
  PER: new ZoningGeometry("perou") 
};

class Zoning {

  /**
   * @static 
   */
  static get Material(){
    return new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0
    })
  }

  /**
   * @constructor
   * @param {Proptype.Info} info 
   */
  constructor(info){
    if (!info.attachment && !info.attachment.countries) return null;
    // TODO Refactoring this.id in this.info_id
    this.id = info.id;
    this.group  = new THREE.Group();
    this.group.name = "zoning-" + info.id;
    this.group.visible = false;
    info.attachment.countries.forEach(element => {
      if (countries[element]) {
        this.group.add(new THREE.Mesh( countries[element], Zoning.Material ))
      }
    });
  }

  display(){
    this.group.children.forEach(child => {
      child.material.opacity = 1;
      child.material.needsUpdate = true;
    })
    this.group.visible = true;
  }

  hide(){
    this.group.children.forEach(child => {
      child.material.opacity = 0;
      child.material.needsUpdate = true;
    })
    this.group.visible = false;
  }

  updateMaterial(config){
    this.group.children.forEach(mesh => {
      config.forEach((value, index) => {
        mesh.material[index] = value; 
        mesh.material.needsUpdate = true;
      })
    })
  }
}

export default Zoning;
