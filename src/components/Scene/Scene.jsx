import React from 'react';
import { connect } from 'react-redux';
import { setCurrentScale } from '../../services/stores/actions';
import ScaleMenu from "./components/ScaleMenu/ScaleMenu";
import ThreeScene from "./../../webgl/Scene";
import { getCurrentScale } from '../../services/stores/reducers/selectors';
import Info from "../Info/Info";

class Scene extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      previousScale: this.props.currentScale
    };

    this.sceneElement = React.createRef();
  }

  componentDidMount(){
    this.threeScene = new ThreeScene({
      element: this.sceneElement.current
    });
  }

  /**
   * @param {string} name Name of scale
   */
  selectScale = (name) => {
    this.threeScene.selectScale(name); 
    this.setState({
      previousScale: this.props.currentScale
    });

    this.props._setCurrentScale(name);
  }

  render(){
    return (
      <>
        <div ref={(this.sceneElement)} className="scene">
            <ScaleMenu scale={this.props.currentScale} onSelectCallback={this.selectScale} />
            <Info />
        </div>
      </>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    currentScale: getCurrentScale(state)
  }
}

const mapDispatchToProps = dispatch => {
  return { 
    _setCurrentScale: scale => {
      dispatch(setCurrentScale(scale));
    }
  }
};



export default connect(mapStateToProps, mapDispatchToProps)(Scene);
