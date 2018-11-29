import React from 'react';
import MicroScale from "./components/MicroScale";
import HumanScale from "./components/HumanScale";
import MacroScale from "./components/MacroScale";
import ScaleMenu from "./components/ScaleMenu/ScaleMenu";

import * as THREE from "three";
import * as dat from "dat.gui";
import OrbitControls from 'orbit-controls-es6';
import Raf from "./../Raf/Raf";

export default class Scene extends React.PureComponent {

  constructor(props){
    super(props);

    this.state = {
      currentScale: "micro",
      targetScale: null,
      microVisibility: 1,
      macroVisibility: 0,
      humanVisibility: 0
    };
    this.microRef = React.createRef();
    this.humanRef = React.createRef();
    this.macroRef = React.createRef();
    this.sceneElement = React.createRef();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.controls = new OrbitControls(this.camera);
    this.scene.background = new THREE.Color(0xFFFFFF);
    window.scene = this.scene;
    this.camera.position.z = 5;
  }

  componentDidMount(){
    this.sceneElement.current.appendChild(this.renderer.domElement);
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    var light = new THREE.PointLight();
    light.position.y = 10;
    this.scene.add(light);

    this.gui = new dat.GUI();

    this.loop();
  }

  /**
   * @param {string} name Name of scale
   */
   selectScale = (name) => {
    if( name !== this.state.currentScale ){
      this.setState(()=>{
        return {
          [this.state.currentScale + "Visibility"]: 0,
          [name + "Visibility"]: 1, 
          currentScale: name
        }
      });
    }
  }

  render(){
    return (
        <>
            <div ref={(this.sceneElement)} className="scene">
                <ScaleMenu scale={this.state.currentScale} onSelectCallback={this.selectScale} />
            </div>
            <MicroScale 
                ref={this.microRef} 
                visibility={this.state.microVisibility} 
                scene={this.scene} />
            <HumanScale 
                ref={this.humanRef} 
                visibility={this.state.humanVisibility} 
                scene={this.scene} />
            <MacroScale 
                ref={this.macroRef} 
                visibility={this.state.macroVisibility} 
                scene={this.scene} />
            <Raf>{[3, this.loop]}</Raf>
        </>
    );
  }

  loop = () => {
    this.renderer.render( this.scene, this.camera );
  }
  
  handleChange(e){
    this.setState({ hello: e.value });
  }
}
