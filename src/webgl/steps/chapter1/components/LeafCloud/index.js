import SimplexNoise from "simplex-noise";
import config from "./config";
import Configuration from "../../../../../helpers/Configuration";

class LeafCloud {
  constructor({
    map = null,
    roughness = null,
    normal = null,
    alpha = null,
    alpha2 = null,
    geometry = null
  } = {}){
    
    this.config = new Configuration({
      position: new THREE.Vector3(0, 0, -10),
      speedRotation: 5.,
      speedPosition: 0.2,
      amplitude: 30
    });

    var material = new THREE.MeshStandardMaterial({ 
      map, 
      roughnessMap: roughness, 
      normalMap: normal,
      alphaMap: alpha, 
      transparent: true, 
      opacity: 1,
      side: THREE.DoubleSide,
      alphaTest: 0.01
    });

    this.count = 500;
    var cluster = new THREE.InstancedMesh(  geometry, material, this.count, true, false );

    var _v3 = new THREE.Vector3();
    var _q = new THREE.Quaternion();
    
    this.items = [];    
    for ( var i = 0 ; i < this.count ; i ++ ) {
      this.items.push({
        position: new THREE.Vector3( Math.random() , Math.random(), Math.random() ),
        rotation: _q.clone()
      })
      cluster.setQuaternionAt( i , this.items[i].rotation );
      cluster.setPositionAt( i , this.items[i].position );
      cluster.setScaleAt( i , _v3.set(1,1,1) );
    }

    this.timeRotation = 0;
    this.timePosition = 0;
    this.noise = new SimplexNoise();
    this.object3D = cluster;
    this.object3D.geometry.maxInstancedCount = 100
  }

  render(time){
    this.timeRotation += this.config.speedRotation*0.0001;
    this.timePosition += this.config.speedPosition*0.0001;
    this.items.forEach((item, i) => {
      this.object3D.setQuaternionAt( i , new THREE.Quaternion(
        this.noise.noise2D(item.rotation.x + i*0.5, this.timeRotation),
        this.noise.noise2D(item.rotation.y + i*0.5, this.timeRotation),
        this.noise.noise2D(item.rotation.z + i*0.5, this.timeRotation),
        this.noise.noise2D(item.rotation.w + i*0.5, this.timeRotation)
      ).normalize() );
      this.object3D.setPositionAt( i , new THREE.Vector3(
        this.noise.noise2D(item.position.x + i*0.5, this.timePosition) * this.config.amplitude,
        this.noise.noise2D(item.position.y + i*0.5, this.timePosition) * this.config.amplitude,
        this.noise.noise2D(item.position.z + i*0.5, this.timePosition) * this.config.amplitude*0.5
      ) );
      
    })

    this.object3D.needsUpdate("position");
    this.object3D.needsUpdate("quaternion");
  }
}

export default LeafCloud;
