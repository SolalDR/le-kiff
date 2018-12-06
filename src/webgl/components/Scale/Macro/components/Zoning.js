import geoARG from "~/datas/geojson/ARG.geo.json";
import geoBOL from "~/datas/geojson/BOL.geo.json";
import geoFRA from "~/datas/geojson/FRA.geo.json";
import geoGUF from "~/datas/geojson/GUF.geo.json";
import geoPER from "~/datas/geojson/PER.geo.json";
import * as THREE from "three";
import GeoCoord from "../../../../helpers/geo/GeoCoord";
import gui from "~/services/gui.js";


var countries = { 
  argentine: geoARG, 
  bolivie: geoBOL, 
  france: geoFRA, 
  guyane: geoGUF,  
  perou: geoPER 
};


class Zoning {

  static Material1 = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide, 
    transparent: true, 
    opacity: 0
  });
  
  constructor(name){
    this.geojson = countries[name];
    if( !this.geojson ) return null;

    this.group = new THREE.Group();
    
    var coordinatesList = [];
    this.geojson.features.forEach((feature, index) => {
      feature.geometry.coordinates.forEach(coordinates => coordinatesList.push(coordinates))
    });

    var shape = new THREE.Shape();
    coordinatesList.forEach(coordinates => {
      shape.moveTo(coordinates[0][0], coordinates[0][1]);
      coordinates.shift();
      coordinates.forEach(coordinate => {
        shape.lineTo(coordinate[0], coordinate[1]);
      });
    })

    var geometry2D = new THREE.ShapeGeometry( shape );
    var geometry3D = new THREE.Geometry();
    geometry2D.vertices.forEach(vertex => {
      geometry3D.vertices.push(new GeoCoord(vertex.y, vertex.x).getCartesianCoord(2.05))
    })

    geometry3D.verticesNeedUpdate = true;
    geometry3D.faces = geometry2D.faces;
    geometry3D.computeFaceNormals();
    geometry3D.computeVertexNormals();
    
    this.object = new THREE.Mesh(geometry3D, new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0
    }));

  } 

}

gui.addMaterial("zoning", Zoning.Material1);

export default Zoning;
