import React from "react";
import PropTypes from "prop-types";
import TimelineItem from "./components/TimelineItem";
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
      reveal: false,
      hover: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      this.updateProgressBar(nextProps.current);
    }
  }

  componentDidMount() {
    this.updateProgressBar(1);
  }

  progress = el => {
    if (el) {
      this.width = el.clientWidth;
      this.itemWidth = this.width / this.props.length;
      this.itemDemiWidth = this.itemWidth / 2;
    }
  };

  onSelect = rank => {
    this.setState({
      current: rank,
      left: this.props.length - rank
    });

    this.props.onStepChangeCallBack(rank);
    this.updateProgressBar(rank);
  };

  onMouse = rank => {
    this.setState({
      hover: rank
    });
  }

  updateProgressBar(rank) {
    const offset = this.itemWidth * (rank - 1);
    this.progressScale = (offset + this.itemDemiWidth) / this.width;
  }

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

  //Rendering elements 
  renderPreviousChapter() {
    if (this.props.previousChapter && this.props.previousChapter.title)
    return (
      <h2 className="timeline__chapter timeline__chapter--prev">
        <div className="timeline__chapter__inner">
          <span className="timeline__chapter__indicator heading-7">
            Previous chapter
          </span>
          <span className="timeline__chapter__title heading-6">
            {this.props.previousChapter.title}
          </span>
        </div>
        <svg width="7" height="11" viewBox="0 0 7 11" className="timeline__chapter__control timeline__chapter__control--prev" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1v8l5-4z" stroke="#FFFFFF" fill="none" fillRule="evenodd"
          />
        </svg>
      </h2>
    )
  }

  renderNextChapter() {
    if (this.props.nextChapter && this.props.nextChapter.title) {
      return (
        <h2 className="timeline__chapter timeline__chapter--next">
          <svg width="7" height="11" viewBox="0 0 7 11" className="timeline__chapter__control timeline__chapter__control--next" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1v8l5-4z" stroke="#FFFFFF" fill="none" fillRule="evenodd" />
          </svg>
          <div className="timeline__chapter__inner">
            <span className="timeline__chapter__indicator heading-7">
              Next chapter
            </span>
            <span className="timeline__chapter__title heading-6">
              {this.props.nextChapter.title}
            </span>
          </div>
        </h2>
      )
    }
  }

  renderTimelineItems() {
    let results = [];
    for (let i = 1; i < this.props.length + 1; i++) {
      (rank =>
        results.push(
          <TimelineItem
            key={rank}
            title={this.props.steps[rank - 1].title}
            rank={rank}
            hover={this.state.hover}
            onSelectCallback={this.onSelect}
            onMouseCallback={this.onMouse}
            active={this.props.current === rank}
            isPassed={this.props.current > rank}
          />
        ))(i);
    }
    return results;
  }

  render() {
    return (
    <div className={`timeline`} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
      <div className={`timeline__wrapper ${this.state.reveal ? "is-active" : ""}`}>
        {/* Conditional rendering for previous chapter */}
        {this.renderPreviousChapter()}

        <div className="timeline__inner">
        <div className="timeline__progress" ref={this.progress} style={{ transform: `scaleX(${this.progressScale})` }} />
          <div className="timeline__list">
            {this.renderTimelineItems()}
          </div>
        </div>

        {/* Conditional rendering for next chapter */}
        {this.renderNextChapter()}
      </div>
    </div>);
  }
}

export default Timeline;
