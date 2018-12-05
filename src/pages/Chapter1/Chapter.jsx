import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getWholeChapter, getStepsLoaded, getIsLoadedChapters } from "../../services/stores/reducers/selectors";
import { setCurrentChapterData, setScale, setCurrentStep, setCurrentInfos } from "../../services/stores/actions";
import Scene from "../../components/Scene/Scene";
import Timeline from "./../../components/Timeline/Timeline";

class Chapter extends React.Component {
    
  static propTypes = {
    chapter: PropTypes.shape({
      api_id: PropTypes.number,
      id: PropTypes.number,
      title: PropTypes.string,
      slug: PropTypes.string,
      type: PropTypes.string,
      content: PropTypes.string,
      steps: PropTypes.array
      }),
    }

    constructor(props) {
        super(props);
        this.state = {
          isReady: false
        };
    }

    componentWillReceiveProps(nextProps) {
      if (!this.state.isReady && nextProps.isStepsLoaded && nextProps.isChapterLoaded) {
        this.setState({ 
          isReady: true 
        });

        const nextChapter = nextProps.chapter;

        this.props._setCurrentChapterData({
          chapter: nextChapter,
          step: nextChapter.steps[0],
          steps: nextChapter.steps,
          infos: nextChapter.steps[0].infos,
          scale: "humain"
        });
      }
    }

    render(){
      if (this.state.isReady) {
        return (
            <div className="chapter chapter-1">
                <Timeline />
                <Scene />
            </div>
        );
      }
      return <h1>Je fais office de chargement pour le moment</h1>
    }
}

const mapStateToProps = (state) => {
  return {
    chapter: getWholeChapter(state, 1),
    isStepsLoaded: getStepsLoaded(state, 1),
    isChapterLoaded: getIsLoadedChapters(state) ,
  }
}

const mapDispatchToProps = dispatch => {
  return { 
    _setCurrentChapterData: chapterData => {
      dispatch(setCurrentChapterData(chapterData));
    }, 
    _setScale: scale => {
      dispatch(setScale(scale));
    }, 
    _setCurrentStep: step => {
      dispatch(setCurrentStep(step));
    }, 
    _setCurrentInfos: infos => {
      dispatch(setCurrentInfos(infos));
    } };
};



export default connect(mapStateToProps, mapDispatchToProps)(Chapter);

