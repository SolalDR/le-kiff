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
        <div class="intro__inner">
          <h1 class="intro__title heading-1">Le Kiff</h1>
          <h2 class="intro__subtitle heading-2">Histoire de disparitions</h2>
          <p class="intro__teasing teasing-1">Découvrez l’histoire d’un caillou de crack, de sa production à sa consommation, et ses conséquences sur la vie, la mort et l’humeur</p>
        </div>
      </div>
    );
  }
}

export default Intro;
