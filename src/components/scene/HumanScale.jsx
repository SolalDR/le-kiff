import React, { Component } from 'react';

export default class HumanScale extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount(){
        
    }

    render(){ return true; }

    loop(){
        this.renderer.render( this.scene, this.camera );
    }
}