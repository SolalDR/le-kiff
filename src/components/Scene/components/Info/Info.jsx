import React from "react";
import "./styles.sass";
import SoundManager from "~/services/soundManager/SoundManager";
import InfoManager from "~/webgl/manager/Info";
import InfoRange from '~/components/Scene/components/Info/InfoRange';
import AbilitiesManager from "../../../../services/AbilitiesManager";

class InfoPoint extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      screenPosition: {x: 0, y: 0}
    }
    this.webGLInfo = null;
  }

  componentWillReceiveProps(nextProps, previousProps){
    if(nextProps.opened !== previousProps.opened) {
      if (this.webGLInfo) {
        this.webGLInfo.click(nextProps.opened);
      }
    }
  }

  componentDidMount(){
    this.webGLInfo = InfoManager.findInfo(this.props.info.id);
  }

  computedClassModifier() {
    return "info-point "
      + (this.props.visible ? "info-point--visible" : "info-point--hidden")
      + " "
      + ((this.props.opened) ? "info-point--opened" : "");
  }

  computedStyle(){
    return {
      transform: `translate3d(${this.state.screenPosition.x}px, ${this.state.screenPosition.y}px, 0)`
    }
  }


  handleClick = () => {
    if( !AbilitiesManager.can( "selectInfo" ) ) return; 
    SoundManager.play('ui_sounds', 'toggle_infopoint');
    if (this.props.onClick) this.props.onClick({
      id: this.props.info.id
    });
  };

  renderContent() {
    switch (this.props.info.type) {
      case 'question':
        return <InfoRange rangeInfo={this.props.info.popin.range} answer={this.props.info.content} />
        break;
      default:
        return  <div className="info-point__text teasing-3" dangerouslySetInnerHTML={{__html: this.props.info.content}}/>
        break;
    }
  }

  render(){
    return (
      <div className={this.computedClassModifier()}
            style={this.computedStyle()}
            ref={(ref) => this.myRef = ref}> 
        <div className="info-point__pointer" onClick={this.handleClick}/>
        <div className="info-point__content">
          <h3 className="info-point__title heading-4">{this.props.info.title}</h3>
          {this.renderContent()}
        </div>
      </div>
    )
  }

}

export default InfoPoint;
