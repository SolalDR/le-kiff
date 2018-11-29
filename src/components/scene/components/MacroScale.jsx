import React from 'react';
import hocScale from "./withScale";
import * as THREE from "three";
import Raf from '../../Raf/Raf';
import MatCapMaterial from "./../../../scripts/components/materials/MatCapMaterial";

class MacroScale extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.loader = new THREE.TextureLoader().load("images/molecule_matcap.jpg", (texture)=>{
      var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new MatCapMaterial({ matcap: texture })
      );
  
      this.props.group.add(mesh);
    });

  }

  render(){ 
    return (
    <Raf>{
      ()=>{
          
      }
    }</Raf>
    ); 
  }

  loop(){
      
  }
}

export default hocScale(MacroScale);
