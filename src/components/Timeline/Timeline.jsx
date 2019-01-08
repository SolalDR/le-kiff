import React from "react";
import PropTypes from "prop-types";
import TimelineItem from "./components/TimelineItem";
import LetterReveal from '~/components/Animations/LetterReveal';
import "./styles.sass";

class Timeline extends React.Component {

  static propTypes = {
    current: PropTypes.number,
    length: PropTypes.number.isRequired,
    chapter: PropTypes.number.isRequired,
    steps: PropTypes.array,
    nextChapter: PropTypes.object,
    previousChapter: PropTypes.object,
    onStepChangeCallBack: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      reveal: false
    };
  }

  onSelect = rank => {
    this.setState({
      current: rank,
      left: this.props.length - rank
    });

    this.props.onStepChangeCallBack(rank);
  };

  onMouseEnter() {
    this.setState({
      reveal: true
    });
  }

  onMouseLeave() {
    if (this.state.reveal) {
      this.setState({
        reveal: false
      });
    }
  }

  render() {
    let results = [];
    for (let i = 1; i < (this.props.length + 1); i++) {
      (rank =>
        results.push(
          <TimelineItem
            key={rank}
            title={this.props.steps[rank - 1].title}
            rank={rank}
            onSelectCallback={this.onSelect}
            active={this.props.current === rank}
          />
        ))(i);
        
    }

    let previousChapter = null;
    // if (this.props.previousChapter && this.props.previousChapter.title) {
      previousChapter = <h2 className="timeline__chapter timeline__chapter--prev">
                          <div className="timeline__chapter__inner">
                            <span className="timeline__chapter__indicator heading-5">Chapitre précédent</span>
                            {/* <span className="timeline__chapter__title heading-4">{this.props.previousChapter.rank}. {this.props.previousChapter.title}</span> */}
                            <span className="timeline__chapter__title heading-4">1. La naissance</span>
                          </div>
                          <svg width="6" height="10" viewBox="0 0 6 10" className="timeline__chapter__control timeline__chapter__control--prev" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M1 1v8l5-4z" stroke="#FFFFFF" fill="none" fillRule="evenodd" />
                          </svg>
                        </h2>;
    // }

    let nextChapter = null;
    if (this.props.nextChapter && this.props.nextChapter.title) {
      nextChapter = <h2 className="timeline__chapter timeline__chapter--next">
                      <svg width="6" height="10" viewBox="0 0 6 10" className="timeline__chapter__control timeline__chapter__control--next" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M1 1v8l5-4z" stroke="#FFFFFF" fill="none" fillRule="evenodd" />
                      </svg>
                      <div className="timeline__chapter__inner">
                        <span className="timeline__chapter__indicator heading-5">Chapitre suivant</span>
                        <span className="timeline__chapter__title heading-4">{this.props.nextChapter.rank}. {this.props.nextChapter.title}</span>
                      </div>
                    </h2>;
    }

    return <div className={`timeline ${this.state.reveal ? 'is-active' : ''}`} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
        {/* Conditional rendering for previous chapter */}
        {previousChapter}

        <div className="timeline__inner">
          <div className="timeline__list">
              {results}
            </div>
        </div>

        {/* Conditional rendering for next chapter */}
        {nextChapter}
      </div>;
  }
}

export default Timeline;
