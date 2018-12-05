import * as THREE from "three";

class GeoCoord {
  
  constructor(lat, lon){
    this.lat = lat;
    this.lon = lon;
    this.radLat = THREE.Math.degToRad(this.lat);
    this.radLon = THREE.Math.degToRad(this.lon);
  }
  
  /**
   * Convert the geocoords in a cartesian repear
   * @param {float} radius 
   */
  getCartesianCoord(radius){
    return new THREE.Vector3(
      radius * Math.cos(this.radLon) * Math.cos(this.radLat),
			radius * Math.cos(this.radLon) * Math.sin(this.radLat),
      -radius * Math.sin(this.radLon)
    );
  }

}

export default GeoCoord;
