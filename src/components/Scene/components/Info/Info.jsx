import React from "react";
import "./styles.sass";
import SoundManager from "~/webgl/components/SoundManager/SoundManager";

class InfoPoint extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
      opened: false,
      screenPosition: {x: 0, y: 0}
    }
  }

  componentWillReceiveProps(nextProps, previousProps){
    console.log("Info.jsx componentWillReceiveProps", nextProps, this.state)
    if( nextProps.currentScale !== previousProps.currentScale ){
      this.setState({visible: nextProps.currentScale === this.props.info.scale })
    }
  }

  computedClassModifier(){
    return "info-point "
      + (this.state.visible ? "info-point--visible" : "info-point--hidden")
      + " "
      + ((this.state.opened) ? "info-point--opened" : "");
  }

  computedStyle(){
    // console.log("Info.jsx computeStyle", this.state.screenPosition)
    return {
      transform: `translate3d(${this.state.screenPosition.x}px, ${this.state.screenPosition.y}px, 0)`
    }
  }

  toggleClass(){
    this.setState({opened: !this.state.opened});
  }

  handleClick = () => {
    this.toggleClass();
    SoundManager.play('toggle_infopoint_sound');
    if (this.props.onClick) this.props.onClick();
  };

  render(){
    return (
      <div className={this.computedClassModifier()}
            style={this.computedStyle()}
            onClick={this.handleClick}
            ref={(ref) => this.myRef = ref}> 
        <div className="info-point__pointer"/>
        <div className="info-point__content">
          <h3 className="info-point__title">{this.props.info.title}</h3>
          <div className="info-point__text" dangerouslySetInnerHTML={{__html: this.props.info.content}}/>
        </div>
      </div>
    )
  }

}

export default InfoPoint;
