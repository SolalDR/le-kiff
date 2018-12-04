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
      if( props.visibility === 0 ) {
        this.group.visible = false;
      }
      this.props.scene.add(this.group);
    }

    loop = () => {
      if( this.state.visibility !== this.props.visibility ){
        let next = this.state.visibility + (this.props.visibility - this.state.visibility)*0.05;
        if( Math.abs(next) < 0.01 ) next = 0;
        if( Math.abs(next) > 0.99 ) next = 1;
        this.setState({
          visibility: next
        });

        if( !this.group.visible && this.state.visibility > 0 ){
          this.group.visible = true;
        }

        if( this.group.visible && this.state.visibility === 0 ){
          this.group.visible = false;
        }
      }
    }
    
    render(){
      return (
      <>
      <Raf>{[2, this.loop]}</Raf>
      <ScaleComponent 
        renderer={this.props.renderer}
        visibility={this.state.visibility}
        currentScale={this.props.currentScale}
        previousScale={this.props.previousScale}
        group={this.group}/> 
      </>
      )
    }
  }
}
