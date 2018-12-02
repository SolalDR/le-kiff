import PDBLoader from  "../helpers/3d/PDBLoader.js";
import BufferGeometryUtils from "../helpers/3d/BufferGeometryUtils.js";
import Event from  "../helpers/Event.js";
import * as THREE from "three";
import * as exportInstancedMesh from "three-instanced-mesh";
import HDRCubeTextureLoader from "./../helpers/3d/HDRCubeTextureLoader";
import PMREMCubeUVPacker from "./../helpers/3d/PMREMCubeUVPacker";
import PMREMGenerator from "./../helpers/3d/PMREMGenerator";
import gui from "./../../../services/gui";

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
    atomGeometry = new THREE.SphereBufferGeometry(0.2, 20, 20),
    envMap = null,
    renderer = null
  } = {}){
    super();
    this.renderer = renderer;
    this.id = Math.floor(Math.random()*10000);
    this.loader = new THREE.TextureLoader();
    this.name = name;
    this.eventsList = ["load"];
    this.object3D = new THREE.Group();
    this.atomGeometry = atomGeometry;
    this.envMap = envMap;
  
    this.load(name);
    this.on("load", this.generateModel.bind(this));
  }

  generateAtomModel(){
    var hdrCubeRenderTarget = null;
    // this.env = new THREE.CubeTextureLoader().setPath( 'images/molecule/ldr/' ).load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] ); 

    var material = new THREE.MeshStandardMaterial({
      envMap: null,
      metalness: 1,
      roughness: 1,
      envMapIntensity: 1,
      emissive: new THREE.Color("rgb(44, 44, 44)")
    });

    this.atomMesh = new InstancedMesh( 
        this.atomGeometry,
        material,
        this.atoms.length,  //instance count
        false,              //is it dynamic
        false,              //does it have color
        true                //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );

    gui.addMaterial("Atom" + this.id, this.atomMesh.material);

    new HDRCubeTextureLoader().setPath( 'images/molecule/hdr/' ).load(
      THREE.UnsignedByteType, 
      [ 'images/molecule/hdr/px.hdr', 'images/molecule/hdr/nx.hdr', 'images/molecule/hdr/py.hdr', 'images/molecule/hdr/ny.hdr', 'images/molecule/hdr/pz.hdr', 'images/molecule/hdr/nz.hdr' ], 
      ( hdrCubeMap ) => {

        var pmremGenerator = new PMREMGenerator( hdrCubeMap );
        pmremGenerator.update( this.renderer );
        var pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
        pmremCubeUVPacker.update( this.renderer );
        hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

        this.atomMesh.material.envMap = hdrCubeRenderTarget.texture;
        this.atomMesh.material.needsUpdate = true; 
        hdrCubeMap.dispose();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();
      }
    );

    this.loader.load("images/molecule/normal.jpg", (texture)=>{
      this.atomMesh.material.normalMap = texture;
      this.atomMesh.material.needsUpdate = true;    
    })

    this.loader.load("images/molecule/roughness.jpg", (texture)=>{
      this.atomMesh.material.roughnessMap = texture;
      this.atomMesh.material.needsUpdate = true;    
    })

    if( this.gui ){
      this.gui.addMaterial(this.name, this.atomMesh.material);
      this.gui.addObject3D(this.name + "mesh", this.atomMesh);    
    }

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
    var material = new THREE.MeshStandardMaterial({
      envMap: this.env,
      metalness: 1,
      roughness: 0.5,
      envMapIntensity: 1,
      color: 0xFFFFFF
    });

    var from = new THREE.Vector3();
    var to = new THREE.Vector3();
    var geometries = [];
    var curve;
    for(var i=0; i<this.bonds.length; i++){
      from = this.atoms[this.bonds[i][0]];
      to = this.atoms[this.bonds[i][1]];
      curve = new THREE.LineCurve(from.clone(), to.clone());
      geometries.push(
        new THREE.TubeBufferGeometry(
          curve,
          1,
          0.02,
          8
        )
      )
    }
    
    var geometry = BufferGeometryUtils.merge(geometries);
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

  generateModel(){
    this.object3D.add(this.generateAtomModel());
    this.object3D.add(this.generateBondModel());
  }

  load(name){
    var loader = new PDBLoader();
    loader.load(
      'molecules/' + name + '.pdb',
      ( pdb ) => {
        var json = pdb.json;
        this.atoms = [];
        json.atoms.forEach(element => this.atoms.push(new THREE.Vector3(element[0], element[1], element[2])));
        this.bonds = json.bonds;
        this.dispatch("load");
      }
    );
  }
}

export default Molecule;
