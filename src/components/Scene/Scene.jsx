import React from 'react';
import MicroScale from "./components/MicroScale";
import HumanScale from "./components/HumanScale";
import MacroScale from "./components/MacroScale";
import ScaleMenu from "./components/ScaleMenu/ScaleMenu";

import * as THREE from "three";
import OrbitControls from 'orbit-controls-es6';
import Raf from "./../Raf/Raf";

window.THREE = THREE;

export default class Scene extends React.PureComponent {

  constructor(props){
    super(props);

    this.state = {
      currentScale: "human",
      previousScale: "human",
      targetScale: null,
      microVisibility: 0,
      macroVisibility: 0,
      humanVisibility: 1
    };
    this.sceneElement = React.createRef();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera);
    this.scene.background = new THREE.Color(0xf2f3ee);
    window.scene = this.scene;
    this.camera.position.z = 5;

    window.addEventListener("resize", ()=>{
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight );
    })
  }

  componentDidMount(){
    this.sceneElement.current.appendChild(this.renderer.domElement);
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    var light = new THREE.PointLight();
    light.position.z = 5;
    light.position.y = 5;
    this.scene.add(light);

    var light2 = new THREE.PointLight();
    light2.position.x = 10;
    light2.position.z = 10;
    this.scene.add(light2);

    this.loop();
  }

  /**
   * @param {string} name Name of scale
   */
   selectScale = (name) => {
    if( name !== this.state.currentScale ){

      if( name === "macro" ){
        this.scene.background = new THREE.Color(0x111111);
      }

      this.setState(()=>{
        return {
          [this.state.currentScale + "Visibility"]: 0,
          [name + "Visibility"]: 1, 
          currentScale: name,
          previousScale: this.state.currentScale
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
                renderer={this.renderer} 
                visibility={this.state.microVisibility}
                currentScale={this.state.currentScale}
                previousScale={this.state.previousScale}
                scene={this.scene} />
            <HumanScale 
                visibility={this.state.humanVisibility}
                currentScale={this.state.currentScale}
                previousScale={this.state.previousScale}
                scene={this.scene} />
            <MacroScale 
                visibility={this.state.macroVisibility}
                currentScale={this.state.currentScale}
                previousScale={this.state.previousScale}
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
