import BufferGeometryUtils from "../../../../helpers/BufferGeometryUtilsOld";
import Event from  "~/helpers/Event";
import config from "./../config";

import * as exportInstancedMesh from "three-instanced-mesh";

var InstancedMesh = exportInstancedMesh(THREE);

/**
 * @class Load and create a molecule 3D object
 */
class Molecule extends Event {

  /**
   * @constructor
   * @param {string} name The name of the molecule, used to create url 
   * @param {THREE.Geometry} atomGeometry The atom instantiate geometry 
   */
  constructor({
    name = null,
    pdb = null,
    bondMaterial = null,
    atomMaterial = null
  } = {}){
    super();
    this.name = name;
    this.bondMaterial = bondMaterial;
    this.atomMaterial = atomMaterial;
    this.object3D = new THREE.Group();
    this.object3D.name = name;
    this.object3D.visible = false;
    this.atomGeometry = new THREE.SphereBufferGeometry(0.5, 16, 16);

    this.parse(pdb);
  }

  generateAtomModel() {
    var geometries = [];
    for ( var i = 0 ; i < this.atoms.length ; i ++ ) {
      var geometry = this.atomGeometry.clone();
      var scaleRandom = 0.75 + Math.random()*0.5;
      geometry.scale(scaleRandom, scaleRandom, scaleRandom)
      geometry.translate(this.atoms[i].x, this.atoms[i].y, this.atoms[i].z);
      geometries.push(geometry)
    }

    var geo = BufferGeometryUtils.merge(geometries);
    this.atomMesh = new THREE.Mesh(geo, this.atomMaterial);

    return this.atomMesh;
  }

  generateBondModel(){
    var from = new THREE.Vector3();
    var to = new THREE.Vector3();
    var geometries = [];
    var curve;
    for(var i=0; i<this.bonds.length; i++){
      from = this.atoms[this.bonds[i][0]];
      to = this.atoms[this.bonds[i][1]];
      curve = new THREE.LineCurve(from.clone(), to.clone());
      geometries.push(
        new THREE.TubeBufferGeometry( curve, 1, 0.15, 8 )
      )
    }
    
    var geometry = BufferGeometryUtils.merge(geometries);
    var mesh = new THREE.Mesh(geometry, this.bondMaterial);

    return mesh;
  }

  attach(info){
    this.info = info;
    this.object3D.visible = true;
  }

  updateFromConfig(config){
    this.object3D.position.copy(config.position)
    this.object3D.scale.copy(config.scale)
    this.object3D.rotation.copy(config.rotation)
  }

  detach(){
    this.info = null;
    this.object3D.visible = false;
  }

  generateModel(){
    this.object3D.add(this.generateAtomModel());
    this.object3D.add(this.generateBondModel());
    this.object3D.scale.copy(new THREE.Vector3(0.8, 0.8, 0.8))
  }

  parse(pdb){
    var json = pdb.json;
    this.atoms = [];
    var localConfig = config.molecules[this.name];
    
    var offset = localConfig && localConfig.offset ? localConfig.offset : new THREE.Vector3()
    json.atoms.forEach(element => this.atoms.push(new THREE.Vector3(element[0], element[1], element[2]).add(offset)));
    this.bonds = json.bonds;
    this.generateModel();
    this.dispatch("load");
  }
}


export default Molecule;
