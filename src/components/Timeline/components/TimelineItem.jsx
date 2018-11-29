import React from "react";

class TimelineItem extends React.Component {
  
  constructor(props){
    super(props);
  }

  handleClick = () => {
    this.props.onSelectCallback(this.props.rank);
  }

  render(){
    var className = this.props.active ? "timeline__item timeline__item--active" : "timeline__item";
    return (
      <div className={className}>
        <button className="timeline__button" onClick={this.handleClick}></button>
      </div>
    )
  }

}

export default TimelineItem;
