import React from "react";
import TimelineItem from "./components/TimelineItem";
import "./styles.sass";

class Timeline extends React.Component {

    constructor(props){
        super(props);

        // Todo rename variable isActive in activeRank or equivalent
        this.state = {
          isActive: 0
        };
    }

    onSelect = (rank) => {
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
          {/* <h2 className="timeline__chapter heading-4">1. La naissance</h2> */}
          <div className="timeline__inner">
            {results}
          </div>
          <h2 className="timeline__chapter heading-4">3. Distribution</h2>
        </div>
      )
    }

}

export default Timeline;
