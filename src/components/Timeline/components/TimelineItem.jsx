import React from "react";
import PropTypes from 'prop-types';

class TimelineItem extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    rank: PropTypes.number.isRequired,
    title: PropTypes.string
  };

  handleClick = () => {
    this.props.onSelectCallback(this.props.rank);
  };

  render() {
    var className = this.props.active
      ? "timeline__item timeline__item--active"
      : "timeline__item";
    return (
      <div className={className}>
        <button className="timeline__item__button" onClick={this.handleClick} />
        <span className="timeline__item__title small">{this.props.title}</span>
      </div>
    );
  }
}

export default TimelineItem;
