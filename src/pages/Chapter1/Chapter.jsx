import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStepsForChapter, getWholeChapter, getStepsLoaded, getIsLoadedChapters } from "~/services/stores/reducers/selectors";
import { setCurrentChapterData, setCurrentScale, setCurrentStep, setCurrentInfos } from "~/services/stores/actions";
import Scene from "~/components/Scene/Scene";
import Timeline from "~/components/Timeline/Timeline";
import Loading from "~/components/Loading/Loading";
import "./styles.sass";

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

    /**
     * @constructor
     * @param {boolean} isReady True if the steps are loaded
     */
    constructor(props) {
        super(props);
        this.state = {
          isReady: false,
          stepId: 1
        };
    }

    componentWillReceiveProps(nextProps) {
      if (!this.state.isReady && nextProps.isStepsLoaded && nextProps.isChapterLoaded) {
        this.setState({ 
          isReady: true 
        });

        const chapter = nextProps.chapter;

        // Update store by UI reducer
        this.props._setCurrentChapterData({
          chapter: chapter,
          step: chapter.steps[this.state.stepId - 1],
          steps: chapter.steps,
          infos: chapter.steps[this.state.stepId - 1].infos,
          scale: "human"
        });
      }
    }

    render () {
      var step = this.props.steps[this.state.stepId];
      if( !step ) step = this.props.steps[0];

      if (this.state.isReady) {
        return (
            <div className="chapter chapter-1">
              <div className="chapter__text">
                <h1 className="chapter__title heading-3">{step.title}</h1>
                <h2 className="chapter__step__text teasing-2">{step.content}</h2>
              </div>
              <Timeline />
              <Scene step={step} />
            </div>
        );
      }
      return <Loading />
    }
}

const mapStateToProps = (state) => {
  return {
    steps: getStepsForChapter(state, 1),
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
    _setCurrentScale: scale => {
      dispatch(setCurrentScale(scale));
    }, 
    _setCurrentStep: step => {
      dispatch(setCurrentStep(step));
    }, 
    _setCurrentInfos: infos => {
      dispatch(setCurrentInfos(infos));
    } };
};



export default connect(mapStateToProps, mapDispatchToProps)(Chapter);

