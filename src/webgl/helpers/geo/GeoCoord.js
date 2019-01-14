
import SphericalCoord from "./SphericalCoord";

class GeoCoord extends SphericalCoord {
  
  constructor(lat, lon){
    super(THREE.Math.degToRad(lat), THREE.Math.degToRad(-lon), new THREE.Vector3());
    this.lat = lat;
    this.lon = -lon;
  }

}

export default GeoCoord;
