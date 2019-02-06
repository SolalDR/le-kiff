import React from "react";
import { connect } from 'react-redux';
import withCursor from '~/components/Cursor/hoc/withCursor';
import PropTypes from 'prop-types';
import { getWholeChapter, getChapter, getStep, getIsChapterReady } from "~/services/stores/reducers/selectors";
import { setCurrentChapterData, setCurrentStepRank } from "~/services/stores/actions";
import Scene from "~/components/Scene/Scene";
import Timeline from "~/components/Timeline/Timeline";
import Loading from "~/components/Loading/Loading";
import "./styles.sass";
import Bus from "../../helpers/Bus";

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
      onRef: PropTypes.func,
      onStepChange: PropTypes.func
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

    componentWillMount() {
      if (!this.props.isChapterReady) {
        this.props.history.push("");
      }
    }

    componentDidMount() {
      Bus.verbose("chapter-1:mounted");
      this.props.onRef(this);

      if (this.props.isChapterReady) {
        this.props.onStepChange(); //Allow cursor
        this.setState({
          isReady: true
        });
  
        this.props._setCurrentChapterData({
          chapter: this.props.chapter,
          step: this.props.chapter.steps[this.state.stepId - 1],
          steps: this.props.chapter.steps,
          infos: this.props.chapter.steps[this.state.stepId - 1].infos,
          scale: "human"
        });
      }

    }

    componentWillUnmount() {
      this.props.onRef(undefined);
    }

    onHoldComplete() {
      this.onStepChange(this.props.step.rank + 1);
      this.props.onStepChange();
    }

    onStepChange = rank => {
      if (rank < this.props.chapter.steps.length) {
        this.props._setCurrentStepRank(rank);
      } else {
        this.onChapterChange(this.props.chapter.rank + 1);
      }
    }

    // TODO Call router to navigate 
    onChapterChange = chapterRank => {

    }

    renderSteps () {
      return this.props.chapter.steps.map((item, rank) => {
        let newDate = new Date();
        const days = item.days * 1
        newDate.setDate(newDate.getDate() + days);
        
        return (
          <div className={`chapter__text ${item.rank == (this.props.step.rank) ? 'is-active' : ''}`} key={`chapter-text-${rank}`}>
            <h1 className="chapter__title heading-5">{item.place} - {newDate.toLocaleDateString('fr', {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </h1>
            <h2 className="chapter__step__text teasing-1">{item.content}</h2>
          </div>
        )
      })
    }

    render () {
      if( !this.props.step.rank ) return null;

      if (this.state.isReady) {
        return (
            <div className="chapter chapter-1">
               {this.renderSteps()}
              <Timeline 
                length={this.props.chapter.steps.length} 
                previousChapter={this.props.previousChapter} 
                nextChapter={this.props.nextChapter} 
                current={this.props.step.rank}
                steps={this.props.chapter.steps} 
                chapter={this.props.chapter.rank} 
                onStepChangeCallBack={this.onStepChange} />

              <Scene step={this.props.step} />
            </div>
        )
      }
      return <Loading />
    }
}

const mapStateToProps = (state) => {
  return {
    chapter: getWholeChapter(state, 1),
    previousChapter: getChapter(state, 0),
    nextChapter: getChapter(state, 2),
    isChapterReady: getIsChapterReady(state, 1),
    step: getStep(state)
  }
}

const mapDispatchToProps = dispatch => {
  return { 
    _setCurrentChapterData: chapterData => {
      dispatch(setCurrentChapterData(chapterData));
    }, 
    _setCurrentStepRank: rank => {
      dispatch(setCurrentStepRank(rank));
    }};
};

export default withCursor(connect(mapStateToProps, mapDispatchToProps)(Chapter));

