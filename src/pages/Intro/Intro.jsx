import React from "react";
import "./styles.sass";

class Intro extends React.Component {
    
  constructor(){
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="intro">
        <div className="intro__inner">
          <h1 className="intro__title heading-1">Le Kiff</h1>
          <h2 className="intro__subtitle heading-2">Histoire de disparitions</h2>
          <p className="intro__teasing teasing-1">Découvrez l’histoire d’un caillou de crack, de sa production à sa consommation, et ses conséquences sur la vie, la mort et l’humeur</p>
        </div>
      </div>
    );
  }
}

export default Intro;
