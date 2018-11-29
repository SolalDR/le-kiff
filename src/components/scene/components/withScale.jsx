import React from "react";
import * as THREE from "three";
import Raf from "./../../Raf/Raf";

export default function higherOrderComponent(ScaleComponent){
  return class extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        visibility: props.visibility,
      };
      this.scaleRef = React.createRef();
      this.group = new THREE.Group();
      this.group.scale.x = props.visibility;
      this.group.scale.y = props.visibility;
      this.group.scale.z = props.visibility;
      this.props.scene.add(this.group);
    }

    loop = () => {
      if( this.state.visibility !== this.props.visibility ){
        let next = this.state.visibility + (this.props.visibility - this.state.visibility)*0.05;
        if( Math.abs(next) < 0.01 ) next = 0;
        this.setState({
          visibility: next
        });

        this.group.scale.x = next;
        this.group.scale.y = next;
        this.group.scale.z = next;
      }
    }
    
    render(){
      return (
      <>
      <Raf>{[2, this.loop]}</Raf>
      <ScaleComponent 
        ref={this.scaleRef} 
        visibility={this.state.visibility}
        scale={this.state.scale} 
        group={this.group}/> 
      </>
      )
    }
  }
}
