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

  initEarth(earth){
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({ 
        map: earth.diffuse.result, 
        normalMap: earth.normal.result,
        emissiveMap: earth.specular.result
      })
    );

    gui.addMaterial("earth", this.earth.material);
    
    this.props.group.add(this.earth);
  }

  componentDidMount(){
    if( AssetManager.loader.isLoaded("earth") ) {
      this.initEarth(AssetManager.loader.getFiles("earth"));
    }
    AssetManager.loader.on("load:earth", (event)=> this.initEarth( event ))
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
