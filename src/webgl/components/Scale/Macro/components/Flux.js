import * as THREE from "three";
import GeoCoord from "../../../../helpers/geo/GeoCoord";
import easing from "./../../../../../helpers/maths/Easing";
import gui from "~/services/gui.js";

/**
 * Represent a geocoord arrow 
 */
class Flux {

  static Material1 = new THREE.MeshBasicMaterial( {
    color: 0xFFFFFF,
    metalness: 0.2,
    roughness: 0,
    opacity: 1
  });

  /**
   * @constructor
   * @param {GeoCoord} from 
   * @param {GeoCoord} to 
   * @param {float} radius 
   * @param {float} amplitude 
   */
  constructor(from, to, radius, amplitude, precision = 50){
    this.from = from.constructor.name === "GeoCoord" ? from : new GeoCoord(from.lat, from.lon); 
    this.to = to.constructor.name === "GeoCoord" ? from : new GeoCoord(to.lat, to.lon); 
    this.radius = radius;
    this.amplitude = amplitude;

    this.computeCurve(precision);
  }

  computeCurve(precision){
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

    var geometry = new THREE.TubeGeometry( this.curve, 25, 0.01, 5, false );
    this.fluxObject = new THREE.Mesh(geometry, Flux.Material1) 
  }
}

gui.addMaterial("flux 1", Flux.Material1);

export default Flux;
