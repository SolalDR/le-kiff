import React from 'react';
import { connect } from 'react-redux';
import { setCurrentScale } from '../../services/stores/actions';
import ScaleMenu from "./components/ScaleMenu/ScaleMenu";
import ThreeScene from "./../../webgl/Scene";
import PropTypes from 'prop-types';


import { getCurrentScale } from '../../services/stores/reducers/selectors';
import Info from "../Info/Info";

class Scene extends React.Component {

  static propTypes = {
      step: PropTypes.shape({
        api_id: PropTypes.number,
        chapter_id: PropTypes.number,
        id: PropTypes.number,
        content: PropTypes.string,
        infos: PropTypes.array,
        slug: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string
      })
    }

  constructor(props){
    super(props);

    this.state = {
      isThreeSceneMounted: false,
      currentStepRank: 1
    };

    this.sceneElement = React.createRef();
  }

  componentDidMount(){
    this.threeScene = new ThreeScene({
      element: this.sceneElement.current
    });
    this.threeScene.selectStep(this.props.step);
    this.setState({isThreeSceneMounted: true});
  }

  componentWillReceiveProps(props){
    if (props.step.rank !== this.props.step.rank) {
      this.threeScene.selectStep(props.step);
    }
  }

  /**
   * @param {string} name Name of scale
   */
  selectScale = (name) => {
    this.threeScene.selectScale(name);
    this.props._setCurrentScale(name);
  }

  renderInfo() {
    if(this.state.isThreeSceneMounted) {
      return <Info point={this.threeScene.getNewPoint()} />
    }
  }

  render(){
    return (
      <>
        <div ref={(this.sceneElement)} className="scene">
            <ScaleMenu scale={this.props.currentScale} onSelectCallback={this.selectScale} />
            {this.renderInfo()}
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
