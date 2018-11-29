import React from 'react';
import hocScale from "./withScale";
import Molecule from "./../../../scripts/components/chemistry/Molecule";
import * as THREE from "three";
import Raf from "./../../Raf/Raf";

class MicroScale extends React.Component {
  constructor(props, ref){
  super(props);
  this.state = {};
  }
  
  componentWillMount(){
  this.env = new THREE.CubeTextureLoader().setPath( '/images/cube/' ).load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
  
  this.molecules = {
    cocaine: new Molecule({name: "cocaine", envMap: this.env, gui: this.gui}),
    kerosen: new Molecule({name: "kerosene", envMap: this.env, gui: this.gui}),
    test2: new Molecule({name: "cocaine", envMap: this.env, gui: this.gui}),
  }
  
  this.molecules.cocaine.on("load", () => {
    this.props.group.add(this.molecules.cocaine.object3D)
    this.props.group.add(this.molecules.test2.object3D)
  });
  
  this.molecules.kerosen.on("load", () => {
    this.props.group.add(this.molecules.kerosen.object3D)
  });
  }
  
  render(){ 
  return ( 
    <Raf>{
    () => {
      this.molecules.kerosen.object3D.rotation.y += (0.01 * this.props.visibility) 
      this.molecules.kerosen.object3D.rotation.x -= (0.01 * this.props.visibility) 
      this.molecules.cocaine.object3D.rotation.x += (0.01 * this.props.visibility) 
      this.molecules.cocaine.object3D.rotation.z -= (0.01 * this.props.visibility) 
      
      this.molecules.test2.object3D.rotation.y += (0.01 * this.props.visibility) 
      this.molecules.test2.object3D.rotation.x -= (0.009 * this.props.visibility)
      
      return null;
    }
    }</Raf>
  )
  }
}

export default hocScale(MicroScale);
  