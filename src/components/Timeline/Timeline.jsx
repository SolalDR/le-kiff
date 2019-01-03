import React from "react";
import PropTypes from "prop-types";
import TimelineItem from "./components/TimelineItem";
import "./styles.sass";

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }

  static propTypes = {
    current: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    chapter: PropTypes.number.isRequired,
    steps: PropTypes.array,
    nextChapter: PropTypes.object,
    previousChapter: PropTypes.object,
    onStepChangeCallBack: PropTypes.func
  };

  onSelect = rank => {
    this.setState({
      current: rank,
      left: this.props.length - rank
    });

    this.props.onStepChangeCallBack(rank);
  };

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
            active={this.state.current === rank}
          />
        ))(i);
    }

    return (
      <div className="timeline">
        {/* Conditional rendering for previous chapter */}
        {this.props.previousChapter && this.props.previousChapter.title && (
          <h2 className="timeline__chapter heading-4">
            {this.props.previousChapter.rank}.{" "}
            {this.props.previousChapter.title}
          </h2>
        )}

        <div className="timeline__inner">{results}</div>

        {/* Conditional rendering for next chapter */}
        {this.props.nextChapter && this.props.nextChapter.title && (
          <h2 className="timeline__chapter heading-4">
            {this.props.nextChapter.rank}. {this.props.nextChapter.title}
          </h2>
        )}
      </div>
    );
  }
}

export default Timeline;
