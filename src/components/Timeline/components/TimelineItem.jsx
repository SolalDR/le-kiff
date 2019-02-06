import React from "react";
import PropTypes from 'prop-types';
import SoundManager from "~/services/soundManager/SoundManager";
import "./styles.sass";

class TimelineItem extends React.Component {
  
  static propTypes = {
    rank: PropTypes.number.isRequired,
    title: PropTypes.string,
    onSelectCallback: PropTypes.func,
    active: PropTypes.bool,
    isPassed: PropTypes.bool
  };

  handleClick = () => {
    SoundManager.play('ui_sounds', 'toggle_default');
    this.props.onSelectCallback(this.props.rank);
  };

  render() {
    var className = this.props.active
      ? "timeline__item is-active"
      : "timeline__item";
    className += this.props.isPassed ? ' is-passed' : '';

    return (
      <div className={className}>
        <button className="timeline__item__button" onClick={this.handleClick} />
        <span className="timeline__item__title teasing-5">{this.props.title}</span>
      </div>
    );
  }
}

export default TimelineItem;
