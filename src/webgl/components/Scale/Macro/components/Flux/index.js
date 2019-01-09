import * as THREE from "three";
import FluxGeometry from "./Geometry"

class Flux {

  static Material = new THREE.MeshBasicMaterial( {
    color: 0xFFFFFF,
    opacity: 1
  });

  /**
   * @constructor
   * @param {Proptypes.Info} info 
   */
  constructor(info){
    if (!info.attachment && !info.attachment.flux) return null;
    // TODO Refactoring this.id in this.info_id
    this.id = info.id;
    this.group  = new THREE.Group();
    this.group.name = "flux-" + info.id;
    this.group.visible = false;
    info.attachment.flux.forEach(element => {
      var fluxGeometry = new FluxGeometry(element);
      this.group.add(new THREE.Mesh( fluxGeometry, Flux.Material));
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

export default Flux;
