import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStepsForChapter, getWholeChapter, getStepsLoaded, getIsLoadedChapters } from "~/services/stores/reducers/selectors";
import { setCurrentChapterData, setCurrentScale, setCurrentStep, setCurrentInfos, setCurrentStepRank } from "~/services/stores/actions";
import Scene from "~/components/Scene/Scene";
import Timeline from "~/components/Timeline/Timeline";
import Loading from "~/components/Loading/Loading";
import "./styles.sass";

class Chapter extends React.Component {
    
  static propTypes = {
    chapter: PropTypes.shape({
      api_id: PropTypes.number,
      id: PropTypes.number,
      rank: PropTypes.number,
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
          scale: "human"
        });
      }
    }

    onStepChange = rank => {
      //@todo : once there is real content
      this.props._setCurrentStepRank(rank);
    }

    onChapterChange = chapterRank => {
      //Call router to navigate 
      console.log("chapter has changed", chapterRank);
    }

    render(){
      if (this.state.isReady) {
        return (
            <div className="chapter chapter-1">
              <div className="chapter__text">
                <h1 className="chapter__title heading-3">{this.props.steps[0].title}</h1>
                <h2 className="chapter__step__text teasing-2">{this.props.steps[0].content}</h2>
              </div>
            <Timeline length={this.props.steps.length} current={0} steps={this.props.steps} chapter={this.props.chapter.rank} onStepChangeCallBack={this.onStepChange} />
              <Scene />
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
    },
    _setCurrentStepRank: rank => {
      dispatch(setCurrentStepRank(rank));
    }};
};



export default connect(mapStateToProps, mapDispatchToProps)(Chapter);

