import React from "react";
import PropTypes from 'prop-types';
import SoundManager from "~/services/soundManager/SoundManager";
import "./styles.sass";
import AbilitiesManager from "~/services/AbilitiesManager";

class TimelineItem extends React.Component {
  
  static propTypes = {
    rank: PropTypes.number.isRequired,
    hover: PropTypes.number,
    title: PropTypes.string,
    onSelectCallback: PropTypes.func,
    onMouseCallback: PropTypes.func,
    active: PropTypes.bool,
    isPassed: PropTypes.bool
  };

  handleClick = () => {
    if( !AbilitiesManager.can("changeStep") ) return;
    SoundManager.play('ui_sounds', 'toggle_default');
    this.props.onSelectCallback(this.props.rank);
  };

  onMouseOver = () => {
    this.props.onMouseCallback(this.props.rank);
  }

  onMouseOut = () => {
    this.props.onMouseCallback(null);
  }

  render() {
    var className = this.props.active
      && (!this.props.hover || this.props.hover != this.props.rank) ? "timeline__item is-active"
      : "timeline__item";
    className += this.props.isPassed ? ' is-passed' : '';

    return (
      <div className={
        `timeline__item 
        ${this.props.active ? 'is-active' : ''} 
        ${this.props.hover && this.props.hover !== this.props.rank ? 'is-semi-hidden' : ''}
        ${this.props.isPassed ? ' is-passed' : ''}
        `} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}>
        <button className="timeline__item__button" onClick={this.handleClick} />
        <span className="timeline__item__title teasing-5">{this.props.title}</span>
      </div>
    );
  }
}

export default TimelineItem;
