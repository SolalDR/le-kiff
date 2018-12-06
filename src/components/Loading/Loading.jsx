import React from "react";
import "./styles.sass";

class Loading extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="loading">
        <h1 className ="heading-1">Chargement ... </h1>
      </div>
    )
  }

}

export default Loading;
