import React from 'react';
import hocScale from "./withScale";
import Molecule from "./../../../scripts/components/chemistry/Molecule";
import * as THREE from "three";

class MicroScale extends React.Component {
    constructor(props, ref){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        this.env = new THREE.CubeTextureLoader().setPath( '/images/cube/' ).load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

        this.molecules = {
            cocaine: new Molecule({name: "cocaine", envMap: this.env, gui: this.gui}),
            kerosen: new Molecule({name: "kerosene", envMap: this.env, gui: this.gui})
        }

        this.molecules.cocaine.on("load", () => {
            this.props.scene.add(this.molecules.cocaine.object3D)
        });
        this.molecules.kerosen.on("load", () => {
            this.props.scene.add(this.molecules.kerosen.object3D)
        });
    }

    render(){ return true; }

    loop() {
        
    }
}

export default hocScale(MicroScale);