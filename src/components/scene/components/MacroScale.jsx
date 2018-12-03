import React from 'react';
import hocScale from "./withScale";
import * as THREE from "three";
import Raf from '../../Raf/Raf';
import gui from "./../../../services/gui";
import AssetManager from "./../../../services/loaders/AssetsManager";
import cloudVert from "./../../../glsl/cloud.vert";
import cloudFrag from "./../../../glsl/cloud.frag";

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

    console.log(cloudVert, cloudFrag);

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.02, 32, 32),
      new THREE.ShaderMaterial({
        vertexShader: cloudVert,
        fragmentShader: cloudFrag,
        uniforms: {
          u_time: { value: 0, type: "f" },
          u_map: { value: earth.cloud.result, type: "t" }
        }
      })
    );

    gui.addMaterial("earth", this.earth.material);
    gui.addMaterial("clouds", this.clouds.material);
    
    this.props.group.add(this.earth);
    this.props.group.add(this.clouds);
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
          if(this.clouds) {
            this.clouds.rotation.y += 0.0005
          }
      }
    }</Raf>
    ); 
  }

  loop(){
      
  }
}

export default hocScale(MacroScale);
