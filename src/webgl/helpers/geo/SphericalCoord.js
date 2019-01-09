

class SphericalCoord {
  constructor(phi, theta){
    this.phi = phi;
    this.theta = theta;
  }

  /**
   * Convert the geocoords in a cartesian repear
   * @param {float} radius 
   * @returns {THREE.Vector3()}
   */
  getCartesianCoord(radius, target = new THREE.Vector3()){
    target.x = radius * Math.cos(this.phi) * Math.cos(this.theta);
    target.y = radius * Math.sin(this.phi);
    target.z = radius * Math.cos(this.phi) * Math.sin(this.theta)
    return target;
  }

  /**
   * Get spherical coord form a position
   * @param {THREE.Vector3} vector The position you want to transform in spherical coord
   * @param {THREE.Vector3}
   */
  static fromCartesian(vector, center = new THREE.Vector3()){
    var diff = vector.clone().sub(center);
    var radius = vector.distanceTo(center);

    return new SphericalCoord(
      Math.acos(diff.y/radius) - Math.PI/2,
      Math.atan(diff.x/diff.z) + Math.PI/2
    );
  }
}
window.SphericalCoord = SphericalCoord;
window.THREE = THREE;
export default SphericalCoord;
