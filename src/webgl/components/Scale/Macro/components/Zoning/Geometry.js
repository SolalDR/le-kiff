import geoARG from "~/datas/geojson/ARG.geo.json";
import geoBOL from "~/datas/geojson/BOL.geo.json";
import geoFRA from "~/datas/geojson/FRA.geo.json";
import geoGUF from "~/datas/geojson/GUF.geo.json";
import geoPER from "~/datas/geojson/PER.geo.json";
import geoCOL from "~/datas/geojson/COL.geo.json";
import GeoCoord from "~/webgl/helpers/geo/GeoCoord";
import {MeshLine} from 'three.meshline'

var countries = { 
  argentine: geoARG, 
  bolivie: geoBOL, 
  france: geoFRA, 
  guyane: geoGUF,  
  perou: geoPER,
  colombie: geoCOL
};

class ZoningGeometry {

  constructor(name, {
    radius = 3
  } = {}){
    this.geojson = countries[name];
    if( !this.geojson ) return null;

    this.group = new THREE.Group();
    var coordinatesList = [];
    this.geojson.features.forEach((feature, index) => {
      feature.geometry.coordinates.forEach(coordinates => coordinatesList.push(coordinates))
    });

    var shape = new THREE.Shape();
    var geometry = new THREE.Geometry();
    coordinatesList.forEach(coordinates => {
      geometry.vertices.push(new THREE.Vector3(coordinates[0][0], coordinates[0][1], 0));
      shape.moveTo(coordinates[0][0], coordinates[0][1]);
      coordinates.shift();
      coordinates.forEach(coordinate => {
        geometry.vertices.push(new THREE.Vector3(coordinate[0], coordinate[1], 0));
        shape.lineTo(coordinate[0], coordinate[1]);
      });
    })

    var geometry2D = new THREE.ShapeGeometry( shape );
    var geometry3D = new THREE.Geometry();
    geometry2D.vertices.forEach(vertex => {
      geometry3D.vertices.push(new GeoCoord(vertex.y, vertex.x).getCartesianCoord(radius))
    })

    geometry.vertices.forEach(vertex => {
      vertex.copy(new GeoCoord(vertex.y, vertex.x).getCartesianCoord(radius))
    })

    geometry3D.verticesNeedUpdate = true;
    geometry3D.faces = geometry2D.faces;
    geometry3D.computeFaceNormals();
    geometry3D.computeVertexNormals();

    
    var line = new MeshLine();
    line.setGeometry(geometry);   

    this.fillGeometry = geometry3D;
    this.strokeGeometry = line.geometry;
  }
}

export default ZoningGeometry;
