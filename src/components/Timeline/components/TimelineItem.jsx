import React from "react";
import PropTypes from 'prop-types';

class TimelineItem extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    rank: PropTypes.number.isRequired,
    title: PropTypes.string,
    onSelectCallback: PropTypes.func,
    active: PropTypes.bool,
    isPassed: PropTypes.bool
  };

  handleClick = () => {
    this.props.onSelectCallback(this.props.rank);
  };

  render() {
    var className = this.props.active
      ? "timeline__item is-active"
      : "timeline__item";
    return (
      <div className={className}>
        <a className="timeline__item__button" onClick={this.handleClick} />
        <span className="timeline__item__title small">{this.props.title}</span>
      </div>
    );
  }
}

export default TimelineItem;
