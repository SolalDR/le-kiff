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
        </div>
      </div>
    );
  }
}

export default About;
