import React from 'react';
import MicroScale from "./components/MicroScale";
import HumanScale from "./components/HumanScale";
import MacroScale from "./components/MacroScale";

import * as THREE from "three";
import * as dat from "dat.gui";
import OrbitControls from 'orbit-controls-es6';


export default class Scene extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {};
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

    render(){
        return (
            <div ref={(this.sceneElement)} className="scene">
                <MicroScale scene={this.scene}></MicroScale>
                <HumanScale scene={this.scene}></HumanScale>
                <MacroScale scene={this.scene}></MacroScale>
            </div> 
        );
    }

    loop(){
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.loop.bind(this));
    }
    
    handleChange(e){
        this.setState({ hello: e.value });
    }
}