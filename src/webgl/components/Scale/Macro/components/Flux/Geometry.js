
import GeoCoord from "~/webgl/helpers/geo/GeoCoord";
import easing from "~/helpers/maths/Easing";

/**
 * Represent a geocoord arrow 
 */
class FluxGeometry {

  /**
   * @constructor
   * @param {GeoCoord} from 
   * @param {GeoCoord} to 
   * @param {float} radius 
   * @param {float} amplitude 
   */
  constructor({ from = null, to = null } = {}, radius = 3, amplitude = 0.4, precision = 50){
    this.from = from.constructor.name === "GeoCoord" ? from : new GeoCoord(from.lat, from.lon); 
    this.to = to.constructor.name === "GeoCoord" ? from : new GeoCoord(to.lat, to.lon); 
    this.radius = radius;
    this.amplitude = amplitude;

    var cartFrom = this.from.getCartesianCoord(this.radius); 
    var cartTo = this.to.getCartesianCoord(this.radius);
    var diff = cartTo.clone().sub(cartFrom);

    var segments = [];
    for(var i=0; i<precision; i++){
      var a = i/precision;
      var altitude = this.amplitude*easing["easeOutQuad"]((a < 0.5 ? a*2 : (0.5 - (a % 0.5))*2));

      var direction = cartFrom.clone().add(
        diff.clone().multiplyScalar(a)
      ).normalize();

      var vertex = direction.clone().multiplyScalar(this.radius + altitude); 
      segments.push(vertex);
    }
    
    this.curve = new THREE.SplineCurve3( segments );

    return new THREE.TubeGeometry( this.curve, 25, 0.01, 5, false );
  }
}

export default FluxGeometry;
