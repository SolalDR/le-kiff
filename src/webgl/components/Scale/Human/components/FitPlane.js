import * as THREE from "three";
import gui from "~/services/gui";

class FitPlane {
  
  constructor({
    background = null, 
    size = 1, 
    distance = 0
  } = {}){
    if( !background ) return; 

    this.background = background;
    var aspect = this.background.image.width/this.background.image.height;

    var geometry = new THREE.PlaneGeometry(size, size/aspect);
  
    this.object3D = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      map: this.background
    }));
    this.object3D.position.z = -distance;

    gui.addMesh("Fit Plane", this.object3D);
  }

}

export default FitPlane;
