import React from "react";
import TimelineItem from "./components/TimelineItem";
import "./styles.sass";

class Timeline extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    onSelect = (e) => {
      console.log("Click rank", e)
    }

    render(){

      var results = [];
      for( var i=0; i < 5; i++ ) {
        ( rank => results.push(<TimelineItem key={rank} rank={rank} onSelectCallback={this.onSelect}/>) )(i);      
      }

      return (
        <div className="timeline">
          {results}
        </div>
      )
    }

}

export default Timeline;
