class LeafBack {
  
  constructor({
    name = null,
    texture = null, 
    position = new THREE.Vector3(),
    rotation = new THREE.Euler(),
    scale = new THREE.Vector3(),
    color = new THREE.Color(),
    size = 1,
    distance = 0
  } = {}){
    if( !texture ) return; 
    this.name = name;
    this.texture = texture;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.color = color;
    var aspect = this.texture.image.width/this.texture.image.height;

    var geometry = new THREE.PlaneGeometry(size, size/aspect);
  
    this.object3D = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true, 
      opacity: 0.99,
      alphaTest: 0.05,
      color: this.color,
      side: THREE.DoubleSide
    }));
    this.object3D.name = this.name
    this.object3D.position.copy(this.position);
    this.object3D.rotation.copy(this.rotation);
    this.object3D.scale.copy(this.scale);
  }

}

export default LeafBack;
