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
      reveal: null
    };
  }

  onSelect = rank => {
    this.setState({
      current: rank,
      left: this.props.length - rank
    });

    this.props.onStepChangeCallBack(rank);
  };

  onMouseEnter(rank) {
    if (this.state.reveal !== rank) {
      this.setState({
        reveal: rank, 
      })
    }
  }

  onMouseLeave(rank) {
    if (this.state.reveal) {
      this.setState({
        reveal: null,
      })
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
    if (this.props.previousChapter && this.props.previousChapter.title) {
      previousChapter = <h2 className="timeline__chapter timeline__chapter--prev heading-4" onMouseLeave={(e) => { this.onMouseLeave(1) }} onMouseEnter={(e) => { this.onMouseEnter(1) }}>
                          <svg width="6" height="10" viewBox="0 0 6 10" className="timeline__chapter__control timeline__chapter__control--prev" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M1 1v8l5-4z" stroke="#FFFFFF" fill="none" fillRule="evenodd" />
                          </svg>
                          <LetterReveal text={`${this.props.previousChapter.rank}. ${this.props.previousChapter.title}`} duration={0.3} delay={0.01} reveal={(this.state.reveal && this.state.reveal === 1) ? true : false} />
                        </h2>;
    } else {
      previousChapter = <span className="timeline__chapter--none"></span>;
    }

    let nextChapter = null;
    if (this.props.nextChapter && this.props.nextChapter.title) {
      nextChapter = <h2 className="timeline__chapter timeline__chapter--next heading-4" onMouseLeave={(e) => { this.onMouseLeave(2) }} onMouseEnter={(e) => { this.onMouseEnter(2) }}>
                      <svg width="6" height="10" viewBox="0 0 6 10" className="timeline__chapter__control timeline__chapter__control--next" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M1 1v8l5-4z" stroke="#FFFFFF" fill="none" fillRule="evenodd" />
                      </svg>
                      <LetterReveal text={`${this.props.nextChapter.rank}. ${this.props.nextChapter.title}`} duration={0.3} delay={0.01} reveal={(this.state.reveal && this.state.reveal === 2) ? true : false} />
                    </h2>;
    } else {
      nextChapter = <span className="timeline__chapter--none"></span>;
    }

    return <div className="timeline">
        {/* Conditional rendering for previous chapter */}
        {previousChapter}

        <div className="timeline__inner">{results}</div>

        {/* Conditional rendering for next chapter */}
        {nextChapter}
      </div>;
  }
}

export default Timeline;
