import React from "react";
import "./styles.sass";
import SoundManager from "~/services/soundManager/SoundManager";
import InfoManager from "~/webgl/manager/Info"

class InfoPoint extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
      screenPosition: {x: 0, y: 0}
    }
    this.webGLInfo = null;
  }

  componentWillReceiveProps(nextProps, previousProps){
    if( nextProps.currentScale !== previousProps.currentScale ){
      this.setState({visible: nextProps.currentScale === this.props.info.scale })
    }

    if(nextProps.opened !== previousProps.opened) {
      if (this.webGLInfo) {
        this.webGLInfo.click(nextProps.opened);
      }
    }
  }

  componentDidMount(){
    this.webGLInfo = InfoManager.findInfo(this.props.info.id);
  }

  computedClassModifier(){
    return "info-point "
      + (this.state.visible ? "info-point--visible" : "info-point--hidden")
      + " "
      + ((this.props.opened) ? "info-point--opened" : "");
  }

  computedStyle(){
    // console.log("Info.jsx computeStyle", this.state.screenPosition)
    return {
      transform: `translate3d(${this.state.screenPosition.x}px, ${this.state.screenPosition.y}px, 0)`
    }
  }


  handleClick = () => {
    
    SoundManager.play('toggle_infopoint_sound');
    if (this.props.onClick) this.props.onClick({
      id: this.props.info.id
    });
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
