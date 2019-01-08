import React from 'react';
import { connect } from 'react-redux';
import { setCurrentScale } from '~/services/stores/actions';
import ScaleMenu from "./components/ScaleMenu/ScaleMenu";
import ThreeScene from "~/webgl/Scene";
import PropTypes from 'prop-types';
import { getCurrentScale } from '~/services/stores/reducers/selectors';
import Info from "./components/Info/Info";
import InfoManager from "~/webgl/components/Info/InfoManager";
import InfoList from "./components/Info/InfoList";

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
    this.updateInfos();
    
    this.setState({isThreeSceneMounted: true});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.step.rank !== nextProps.step.rank) {
      /**
       * Before scene component is rendered, update current step in the webgl scene
       * new Step is created and is ready to receive infos
       */
      this.threeScene.selectStep(nextProps.step);
    }
  }

  /**
   * @param {string} name Name of scale
   */
  selectScale = (name) => {
    this.threeScene.selectScale(name);
    this.props._setCurrentScale(name);
  }

  /**
   * Fire at initialisation & rendering, notice scene to update listened point position
   * @return {[PropTypes.infos]} Return the filtered list 
   */
  updateInfos(){
    var infos = this.props.step.infos.filter(info => info.scale === this.props.currentScale);
    this.threeScene.updateInfos(infos);
    return infos;
  }

  render(){
    return (
      <div ref={(this.sceneElement)} className="scene">
          <ScaleMenu scale={this.props.currentScale} onSelectCallback={this.selectScale} />
          <InfoList infos={this.threeScene ? this.updateInfos() : []}></InfoList>
      </div>
    );
  }
}

const mapStateToProps = state => {
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
