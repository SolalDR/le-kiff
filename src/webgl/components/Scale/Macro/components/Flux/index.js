import FluxGeometry from "./Geometry"
import {MeshLine, MeshLineMaterial} from 'three.meshline'
import {guiMacro} from "~/services/gui"
import config from "./config";

console.log(config.material);
class Flux {

  static Material = new THREE.MeshBasicMaterial( {
    color: 0xFFFFFF,
    opacity: 1
  });

  static LineMaterial = new MeshLineMaterial({
    lineWidth: config.material.lineWidth,
    dashOffset: 0,
    dashArray: config.material.dashArray,
    dashRatio: config.material.dashRatio,
    transparent: true
  })

  /**
   * @constructor
   * @param {Proptypes.Info} info 
   */
  constructor(info, {
    gui = null
  } = {}){
    if (!info.attachment && !info.attachment.flux) return null;
    // TODO Refactoring this.id in this.info_id
    this.gui = gui;
    this.id = info.id;
    this.group  = new THREE.Group();
    this.group.name = "flux-" + info.id;
    this.group.visible = false;
    info.attachment.flux.forEach(element => {
      var line = new MeshLine();
      var fluxGeometry = new FluxGeometry(element);
      line.setGeometry(fluxGeometry, function ( p ) { return Math.sin(Math.PI*p)*0.5 });      
      this.group.add(new THREE.Mesh( line.geometry, Flux.LineMaterial));
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
    this.group.children.forEach(mesh => {
      config.forEach((value, index) => {
        mesh.material[index] = value; 
        mesh.material.needsUpdate = true;
      })
    })
  }
}

var folder = guiMacro.addFolder("Flux");
folder.add(Flux.LineMaterial.uniforms.lineWidth, "value", 0, 2).name("lineWidth")
folder.add(Flux.LineMaterial.uniforms.dashArray, "value", 0, 1).name("dashArray")
folder.add(Flux.LineMaterial.uniforms.dashRatio, "value", 0, 1).name("dashRatio")
folder.add(Flux.LineMaterial.uniforms.visibility, "value", -1, 1).name("visibility")
folder.addThreeColor(Flux.LineMaterial.uniforms.color, "value").name("Color")
folder.add(config, "dashOffsetSpeed", 0, 0.1);

Flux.LineMaterial.onBeforeCompile = e => {
  
}

export default Flux;
