import BufferGeometryUtils from "../../../../helpers/BufferGeometryUtilsOld";
import Event from  "~/helpers/Event";

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
    material = null
  } = {}){
    super();
    this.name = name;
    this.material = material;
    this.object3D = new THREE.Group();
    this.object3D.name = "molecule_" + name;
    this.object3D.visible = false;
    this.atomGeometry = new THREE.SphereBufferGeometry(0.2, 20, 20);

    this.parse(pdb);
  }

  generateAtomModel(){
    this.atomMesh = new InstancedMesh( 
      this.atomGeometry,
      this.material,
      this.atoms.length,  //instance count
      false,              //is it dynamic
      false,              //does it have color
      true                //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );

    var _v3 = new THREE.Vector3();
    var _q = new THREE.Quaternion();
    for ( var i = 0 ; i < this.atoms.length ; i ++ ) {
      this.atomMesh.setQuaternionAt(i , _q);
      this.atomMesh.setPositionAt(i , _v3.set( this.atoms[i].x , this.atoms[i].y, this.atoms[i].z ));
      this.atomMesh.setScaleAt(i , _v3.set(1,1,1));
    }

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
        new THREE.TubeBufferGeometry( curve, 1, 0.02, 8 )
      )
    }
    
    var geometry = BufferGeometryUtils.merge(geometries);
    var mesh = new THREE.Mesh(geometry, this.material);

    return mesh;
  }

  attach(info){
    this.info = info;
    this.object3D.visible = true;
  }

  detach(){
    this.info = null;
    this.object3D.visible = false;
  }

  generateModel(){
    this.object3D.add(this.generateAtomModel());
    this.object3D.add(this.generateBondModel());
  }

  parse(pdb){
    var json = pdb.json;
    this.atoms = [];
    json.atoms.forEach(element => this.atoms.push(new THREE.Vector3(element[0], element[1], element[2])));
    this.bonds = json.bonds;
    this.generateModel();
    this.dispatch("load");
  }
}


export default Molecule;
