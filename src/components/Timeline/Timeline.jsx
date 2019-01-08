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
      reveals: [false, false]
    };
  }

  onSelect = rank => {
    this.setState({
      current: rank,
      left: this.props.length - rank
    });

    this.props.onStepChangeCallBack(rank);
  };

  onMouseOver(e, rank) {
    if (!this.state.reveals[rank]) {
      const currentReveals = this.state.reveals;
      currentReveals[rank] = true;
  
      this.setState({
        reveals: currentReveals, 
      })
    }
  }

  onMouseOut(e, rank) {
    const currentReveals = this.state.reveals;
    currentReveals[rank] = false;

    this.setState({
      reveals: currentReveals,
    })
  }

  render() {
    var results = [];
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

    return <div className="timeline">
        {/* Conditional rendering for previous chapter */}
        {this.props.previousChapter && this.props.previousChapter.title && <h2 className="timeline__chapter heading-4">
            {this.props.previousChapter.rank}. {this.props.previousChapter.title}
          </h2>}

        <div className="timeline__inner">{results}</div>

        {/* Conditional rendering for next chapter */}
        {this.props.nextChapter && this.props.nextChapter.title && <h2 className="timeline__chapter heading-4">
        <svg width="6" height="10" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg" onMouseOut={(e) => { this.onMouseOut(e, 1) }} onMouseOver={(e) => { this.onMouseOver(e, 1) }}>
              <path d="M1 1v8l5-4z" stroke="#FFFFFF" fill="none" fillRule="evenodd" />
            </svg>
            <LetterReveal text={`${this.props.nextChapter.rank}. ${this.props.nextChapter.title}`} duration={0.3} delay={0.03} reveal={this.state.reveals[1]} />
          </h2>}
      </div>;
  }
}

export default Timeline;
