import React from 'react';
import hocScale from "./withScale";
import * as THREE from "three";
import Raf from '../../Raf/Raf';
import gui from "./../../../services/gui";
import AssetManager from "./../../../services/loaders/AssetsManager";

class MacroScale extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.loader = new THREE.TextureLoader().load("images/molecule_matcap.jpg", (texture)=>{
 
      AssetManager.loader.on("load:earth", (event)=>{
        console.log(event);
        var mesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 32, 32),
          new THREE.MeshStandardMaterial({ 
            map: event.diffuse.result, 
            normalMap: event.normal.result,
            emissiveMap: event.specular.result
          })
        );

        gui.addMaterial("earth", mesh.material);
        
        this.props.group.add(mesh);
      })
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
