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
        emissiveMap: earth.specular.result,
      })
    );

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.02, 32, 32),
      new THREE.ShaderMaterial({
        vertexShader: cloudVert,
        fragmentShader: cloudFrag,
        uniforms: {
          u_time: { value: 0, type: "f" },
          u_map: { value: earth.cloud.result, type: "t" }, 
          u_noise: { value: earth.noise.result, type: "t" }, 
          u_alpha:  {type: "f", value: 0.5}
        },
        transparent: true
      })
    );

    gui.addMaterial("earth", this.earth.material);
    gui.addMaterial("clouds", this.clouds.material);
    
    this.props.group.add(this.earth);
    this.props.group.add(this.clouds);
  }
  
  componentDidMount(){
    if( AssetManager.loader.isLoaded("global") ) {
      this.initEarth(AssetManager.loader.getFiles("global"));
    }
    AssetManager.loader.on("load:global", (event)=> this.initEarth( event ))
  }

  render(){ 
    return (
    <Raf>{
      ()=>{
          if(this.clouds) {
            this.clouds.material.uniforms.u_time.value += 0.0001;
            this.clouds.material.needsUpdate = true;
          }
      }
    }</Raf>
    ); 
  }

  loop(){
      
  }
}

export default hocScale(MacroScale);
