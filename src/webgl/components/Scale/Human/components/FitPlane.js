import * as THREE from "three";

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
  }

}

export default FitPlane;
