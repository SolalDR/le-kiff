import React from 'react';
import hocScale from "./withScale";
import * as THREE from "three";
import Raf from "./../../Raf/Raf"
import MatCapMaterial from "./../../../scripts/components/materials/MatCapMaterial";

class HumanScale extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount(){
    this.loader = new THREE.TextureLoader().load("images/molecule_matcap.jpg", (texture)=>{
      var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new MatCapMaterial({ matcap: texture })
      );
  
      this.props.group.add(mesh);
    });
  }

  render(){ return (
    <Raf>{
        ()=>{
            
        }
    }</Raf>
    ); 
  }

  loop(){
      
  }
}

export default hocScale(HumanScale);
