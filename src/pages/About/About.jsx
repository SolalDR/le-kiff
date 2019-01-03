import React from "react";
// import "./styles.sass";

class About  extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="about">
        <div className="cover__inner">
          <h1 className="cover__title heading-3">À propos</h1>
          <h2 className="intro__subtitle heading-2">Histoire de disparitions</h2>
          <p className="intro__teasing teasing-1">Découvrez l’histoire d’un caillou de crack, de sa production à sa consommation, et ses conséquences sur la vie, la mort et l’humeur</p>
        </div>
      </div>
    );
  }
}

export default About;
