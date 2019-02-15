//React
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Transition, TransitionGroup } from 'react-transition-group';

import AppManagerHydrator from './components/AppManagerHydrator/AppManagerHydrator';

//Transitions
import { exitIntro } from './pages/Intro/transitions';
import { exitChapter1 } from './pages/Chapter1/transitions';
import { exitChapter2, enterChapter2 } from './pages/Chapter2/transitions';
import { enterStatic, exitStatic } from './pages/transitions';

//Components
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

const firstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};

class App extends Component {

  constructor(props){
    super(props);
    this.manager = AppManager;
    Bus.verboseLevel = 0;
 
    this.state = {
      chapterLoaded: false
    } 
  }

  componentDidMount() {
  }

  onEntering = (location) => {
    const intro = document.querySelector('.intro');
    const chapter1 = document.querySelector('.chapter-1');
    const chapter2 = document.querySelector('.chapter-2');
    const staticPage = document.querySelectorAll('.static-page');

    if (intro && location.pathname != '/') {
      exitIntro(intro);
    }

    if (chapter1 && !(location.pathname.indexOf('chapter-1') > 0)) {
      exitChapter1(chapter1);
    }

    if (chapter1 && location.pathname.indexOf('chapter-2') > 0) {
      exitChapter1(chapter1);
    }

    if (chapter2 && location.pathname.indexOf('chapter-2') > 0) {
      enterChapter2(chapter2);
    }

    if (staticPage.length) {
      if (staticPage.length > 1) {
        for (let i = 1; i < staticPage.length; i++) {
          exitStatic(staticPage[i]);
        }
        enterStatic(staticPage[0]);
      } else {
        enterStatic(staticPage[0]);
      }
    }
  }

  onExit = (location) => {
    const intro = document.querySelector('.intro');
    const chapter1 = document.querySelector('.chapter-1');

    
  }

  handleEnter(path) {

  }

  handleRouteChange = (path, nbChangeRoute) => {
    this.manager.loadFromPath(path);

    if (nbChangeRoute === 0) {
      this.handleEnter(path);
    }
  }

  renderEnterTransition = (key, dom) => {
   
  }

  renderExitTransition = (key, dom) => {
    
  }
  

  render() {

    return (
      <Provider store={store}>
        <Router>
          <Route render={({location}) => (
            <div className="app">
              <AppManagerHydrator onRouteChange={this.handleRouteChange} />
              <Header />
              <div className="app__content">
                <TransitionGroup >
                  <Transition key={location.key} classNames="fade" timeout={3000} appear={true} onEntering={() => this.onEntering(location)} onExit={() => this.onExit(location)} exitDone={() => console.log('exxit done')} enterDone={() => console.log('enter done')}>
                    <Switch location={location}>
                      <Route exact path="/" component={ Intro } />
                      <Route exact path="/chapter-1" component={ Chapter1 } />
                      <Route exact path="/chapter-2" component={ Chapter2 } />
                      <Route exact path="/outro" component={Outro} />
                      <Route exact path="/about" component={About} />
                      <Route exact path="/credits" component={Credits} /> 
                    </Switch>
                  </Transition>
               </TransitionGroup>
              </div>
            </div>
          )} />
        </Router>
      </Provider>
    );
  }
}

export default App;
