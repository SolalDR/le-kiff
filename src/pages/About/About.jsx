import React from "react";
import "./styles.sass";

class About  extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="about static-page">
        <div className="cover__inner">
          <h1 className="cover__title heading-5">About</h1>
        </div>
        <div class="panel">
          <h2 className="heading-3 panel__title">About</h2>
          <div class="panel__inner">
            <div class="panel__item">
                <p class="teasing-1"><em>The Kiff, stories of disappearances</em>, is a webdocumentary that tells the life of a crack pebble, from its birth to its consumption. The ambition of this project is to highlight the issues that are related to this drug traffick.</p>
                <p class="teasing-1">This project was directed by Léa Tanda, Solal Revel, Bastien Cornier, Jade Dalloul and Matthieu Pajot as part of the first year of the Gobelins school's DMII.</p>
                <p class="teasing-1">This webdocumentary does not pretend to provide professional journalistic quality informations even though a serious investigation work has been conducted in tight time constraints.</p>
            </div>
            <div class="panel__item">
              <h3 class="heading-4 panel__item__title">Act up</h3>
              <ul class="panel__list">
                <li class="list__item teasing-1"><a href="http://www.asud.org/" class="list__link">www.asud.org</a></li>
                <li class="list__item teasing-1" ><a href="http://www.asud.org/" class="list__link">www.asud.org</a></li>
              </ul>
            </div>
            <div class="panel__item">
              <h3 class="heading-4 panel__item__title">Go deeper</h3>
              <ul class="panel__list">
                <li class="list__item teasing-1"><a href="http://www.asud.org/" class="list__link">www.asud.org</a></li>
                <li class="list__item teasing-1" ><a href="http://www.asud.org/" class="list__link">www.asud.org</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
