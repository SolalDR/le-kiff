import React, { Component } from 'react';
import MicroScale from "./MicroScale";
import HumanScale from "./HumanScale";
import MacroScale from "./MacroScale";

import * as THREE from "three";
import Molecule from "../scripts/components/chemistry/Molecule.js";
import OrbitControls from 'orbit-controls-es6';
import * as dat from 'dat.gui';


export default class Scene extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.sceneElement = React.createRef();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.controls = new OrbitControls(this.camera)
        this.scene.background = new THREE.Color(0xFFFFFF);
        window.scene = this.scene;
        this.camera.position.z = 5;
    }

    componentDidMount(){

        this.sceneElement.current.appendChild(this.renderer.domElement);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.env = new THREE.CubeTextureLoader().setPath( '/images/cube/' ).load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

        var light = new THREE.PointLight();
        light.position.y = 10;
        this.scene.add(light);

        this.gui = new dat.GUI();

        this.molecules = {
            cocaine: new Molecule({name: "cocaine", envMap: this.env, gui: this.gui}),
            kerosen: new Molecule({name: "kerosene", envMap: this.env, gui: this.gui})
        }

        this.molecules.cocaine.on("load", () => this.scene.add(this.molecules.cocaine.object3D));
        this.molecules.kerosen.on("load", () => this.scene.add(this.molecules.kerosen.object3D));
        this.renderer.setAnimationLoop(this.loop.bind(this));
    }

    render(){
        return (
            <div ref={this.sceneElement} className="scene">
                <MicroScale scene={this.scene}></MicroScale>
                <HumanScale scene={this.scene}></HumanScale>
                <MacroScale scene={this.scene}></MacroScale>
            </div>
        );
    }

    loop(){
        this.renderer.render( this.scene, this.camera );
    }
    
    handleChange(e){
        this.setState({ hello: e.value });
    }
}