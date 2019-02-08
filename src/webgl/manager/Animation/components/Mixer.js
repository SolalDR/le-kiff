export default {
  /**
   * Mix a color
   * @param {THREE.Color} from
   * @param {THREE.Color} to
   * @param {float} mix
   * @param {THREE.Color} object
   */
  color: (from, to, mix, object = new THREE.Color()) => {
    object.r = from.r + (to.r - from.r)*mix;
    object.g = from.g + (to.g - from.g)*mix;
    object.b = from.b + (to.b - from.b)*mix;
    return object;
  },

  vector3: (from, to, mix, object = new THREE.Vector3()) => {
      object.x = from.x + (to.x - from.x)*mix;
      object.y = from.y + (to.y - from.y)*mix;
      object.z = from.z + (to.z - from.z)*mix;
      return object;
  },

  float: (from, to, mix, object = 0) => {
    return from + (to - from) * mix;
  }
}
