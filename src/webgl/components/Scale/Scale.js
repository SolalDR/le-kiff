import * as THREE from "three";

class Scale {

  constructor({
    visibility = 1
  }){
    this.state = {
      visibility: visibility,
    };

    this.group = new THREE.Group();
    this.group.scale.x = visibility;
    this.group.scale.y = visibility;
    this.group.scale.z = visibility;

    if( visibility === 0 ) {
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
}
