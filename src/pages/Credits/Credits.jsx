import React from "react";
import "./styles.sass";

class Credits  extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="credits static-page">
        <div className="cover__inner">
          <h1 className="cover__title heading-5">Credits</h1>
        </div>
        <div class="panel">
          <h2 className="heading-3 panel__title">Credits</h2>
          <div class="panel__inner">
            <div class="panel__item">
                <p class="teasing-1">We would like to thank Janlyn Williams and Kevin Elbaz for lending us their voices, Maëlle Cornier for the translation of the texts and the whole Gobelins teaching team for their help on the project.</p>
            </div>
            <div class="panel__item">
              <h3 class="heading-4 panel__item__title">Development</h3>
              <ul class="panel__list">
                <li class="list__item teasing-1"><a href="http://www.asud.org/" class="list__link">Bastien Cornier</a></li>
                <li class="list__item teasing-1" ><a href="http://www.asud.org/" class="list__link">Solal Dussout-Revel</a></li>
                <li class="list__item teasing-1" ><a href="http://www.asud.org/" class="list__link">Léa Tanda</a></li>
              </ul>
            </div>
            <div class="panel__item">
              <h3 class="heading-4 panel__item__title">Design</h3>
              <ul class="panel__list">
                <li class="list__item teasing-1"><a href="http://www.asud.org/" class="list__link">Matthieu Pajot</a></li>
                <li class="list__item teasing-1" ><a href="http://www.asud.org/" class="list__link">Jade Dalloul</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Credits;
