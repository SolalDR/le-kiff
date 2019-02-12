import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppManagerHydrator from './components/AppManagerHydrator/AppManagerHydrator';
import Chapter1 from "./pages/Chapter1/Chapter";
import Chapter2 from "./pages/Chapter2/Chapter";
import Intro from "./pages/Intro/Intro";
import Outro from "./pages/Outro/Outro";
import About from "./pages/About/About"
import Credits from "./pages/Credits/Credits"
import Header from "./components/Header/Header";
import AppManager from "./services/AppManager.js"
import { store } from './services/stores/store';
import Bus from "~/helpers/Bus";
import "./styles/app.sass";

Bus.registerGroup("scale", [ "color: red" ]);
Bus.registerGroup("step", [ "color: blue" ]);
Bus.registerGroup("history", [ "color: green" ]);
Bus.registerGroup("controls", [ "color: purple" ]);
Bus.registerGroup("infos", [ "color: salmon" ]);
Bus.registerGroup("api", [ "color: purple" ]);
Bus.registerGroup("cursor", [ "color: orange" ]);

window.bus = Bus

class App extends Component {

  constructor(props){
    super(props);
    this.manager = AppManager;
    Bus.verboseLevel = 0;

    this.state = {
      chapterLoaded: false
    } 
  }

  handleRouteChange = (path) => {
    this.manager.loadFromPath(path);
  }

  render() {

    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <AppManagerHydrator onRouteChange={this.handleRouteChange} />
            <Header />
            <div className="app__content">
              <Route exact path="/" component={Intro} />
              <Route exact path="/chapter-1" component={ Chapter1 } />
              <Route exact path="/chapter-2" component={ Chapter2 } />
              <Route exact path="/outro" component={Outro} />
              <Route exact path="/about" component={About} />
              <Route exact path="/credits" component={Credits} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
