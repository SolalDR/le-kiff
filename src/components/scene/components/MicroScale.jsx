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
  
  componentDidMount(){
    this.molecules = {
      cocaine: new Molecule({name: "cocaine", envMap: this.env, gui: this.gui, renderer: this.props.renderer}),
      kerosen: new Molecule({name: "kerosene", envMap: this.env, gui: this.gui, renderer: this.props.renderer}),
    }
    
    this.molecules.cocaine.on("load", () => {
      this.props.group.add(this.molecules.cocaine.object3D)
    });
    
    this.molecules.kerosen.on("load", () => {
      this.props.group.add(this.molecules.kerosen.object3D)
    });
  }
  
  render(){ 
  return ( 
    <Raf>{
    () => {
      return null;
    }
    }</Raf>
  )
  }
}

export default hocScale(MicroScale);
  