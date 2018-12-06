import React from "react";
import TimelineItem from "./components/TimelineItem";
import "./styles.sass";

class Timeline extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          isActive: 0
        };
    }

    onSelect = (rank) => {
      console.log("Click rank", rank)
      this.setState({
        isActive: rank
      });
    }

    render(){

      var results = [];
      for( var i=0; i < 5; i++ ) {
        ( rank => results.push(<TimelineItem key={rank} rank={rank} onSelectCallback={this.onSelect} active={this.state.isActive === rank} />) )(i);      
      }

      return (
        <div className="timeline">
          {results}
        </div>
      )
    }

}

export default Timeline;
