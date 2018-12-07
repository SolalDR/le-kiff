import React from "react";
import {connect} from 'react-redux';
import { getCurrentInfos, getCurrentScale } from '~/services/stores/reducers/selectors';

class Info extends React.Component {

  constructor(props){
    super(props);
    this.toggleClass= this.toggleClass.bind(this);
    this.state = {
      active: false,
      scale: this.props.scale,
      point : props.point
    };

    this.state.point.on('positionChanged', (e) => {
      this.setState({screenPos: e})
    })
  }

  toggleClass() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  renderInfo() {
    return this.props.infos.map((info) => {
      if (info.scale === this.props.scale) {
        return (
          <div key={info.id}
               className={'InfoPoint ' + (this.state.active ? 'InfoPoint--open ' : '')}
               onClick={this.toggleClass}
               style={
                 {
                   transform: `translate3d( ${this.state.point.screenPos.x}px, ${this.state.point.screenPos.y}px, 0)`
                 }
               }
          >
            <div className="InfoPoint__pointer"/>
            <div className="InfoPoint__content">
              <h3 className="InfoPoint__title">{info.title}</h3>
              <div className="InfoPoint__text" dangerouslySetInnerHTML={{__html: info.content}}/>
            </div>
          </div>
        )
      } else {
        return null
      }
    })
  }

  render(){
    return (
      <>
        {this.renderInfo()}
      </>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    infos: getCurrentInfos(state),
    scale: getCurrentScale(state)
  }
};

export default connect(mapStateToProps)(Info);
