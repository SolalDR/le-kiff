import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChapter } from "../../services/stores/reducers/selectors";
import { setCurrentChapterData, setScale, setCurrentStep, setCurrentInfos } from "../../services/stores/actions";
import Scene from "../../components/Scene/Scene";
import Timeline from "./../../components/Timeline/Timeline";

class Chapter extends React.Component {
    
  static propTypes = {
    chapter: PropTypes.shape({
      api_id: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      steps: PropTypes.array
      }),
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps) {
      const currentId = this.props.chapter.id
      if (currentId && prevProps.chapter && prevProps.chapter.id !== currentId) {
        const steps = this.props.chapter.steps;

        this.props._setCurrentChapterData({
          chapter: this.props.chapter,
          step: steps && steps.length ? steps[0] : [],
          infos: steps && steps.length ? steps[0].infos : [],
          scale: "humain"
        });
      }
    }

    render(){
        return (
            <div className="chapter chapter-1">
                <Timeline />
                <Scene />
            </div>
        );
    }
}

const mapStateToProps = state => {
  console.log('STATE in Chapter1', state);
  return {
    chapter: getChapter(state, 1)
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

