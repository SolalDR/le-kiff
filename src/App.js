//React
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Transition, TransitionGroup, CSSTransition } from 'react-transition-group';

import AppManagerHydrator from './components/AppManagerHydrator/AppManagerHydrator';

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
    Bus.verboseLevel = 1;

    this.state = {
      chapterLoaded: false
    } 
  }

  onEntering = () => {
    const intro = document.querySelector('.intro');

    if (intro) {
      intro.classList.add('is-hidden');
    }
  }

  onExit = () => {
    const intro = document.querySelector('.intro');

    if (intro) {
      intro.classList.remove('is-hidden');
    }
  }

  handleRouteChange = (path) => {
    this.manager.loadFromPath(path);
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
                  <Transition key={location.key} classNames="fade" timeout={3000} onEntering={this.onEntering} onExit={this.onExit} exitDone={() => console.log('exxit done')} enterDone={() => console.log('enter done')}>
                    <Switch location={location}>
                      <Route exact path="/" component={ Intro } />
                      <Route exact path="/chapter-1" component={ Chapter1 } />
                      <Route exact path="/chapter-2" component={ Chapter2 } />
                      <Route exact path="/outro" component={Outro} />
                      <Route exact path="/about" component={About} />
                      <Route exact path="/credits" component={Credits} /> 
                    </Switch>
                  </Transition>
                  
                {/* </TransitionGroup>
                <Transition in={location.pathname == '/'} key={'intro'} timeout={2000} onExit={(dom) => this.renderExitTransition('intro', dom)} onEnter={(dom) => this.renderEnterTransition('intro', dom)}>
                </Transition>
                <Transition in={location.pathname.indexOf('chapter-1') > 0}  key={'chapter-1'} timeout={2000} onExit={(dom) => this.renderExitTransition('chapter', dom)} onEnter={(dom) => this.renderEnterTransition('chapter', dom)}>
                  
                </Transition>
                <Transition in={location.pathname.indexOf('about') > 0} key={'about'} timeout={2000} onExit={() => this.renderExitTransition('default')} onEnter={() => this.renderEnterTransition('default')}>
                  <Route exact path="/about" component={ About } />
                </Transition>
                <Transition in={location.pathname.indexOf('outro') > 0} key={'outro'} timeout={2000} onExit={() => this.renderExitTransition('default')} onEnter={() => this.renderEnterTransition('default')}>
                  <Route exact path="/outro" component={ Outro } />
                </Transition>
                <Transition in={location.pathname.indexOf('credits') > 0} key={'credits'} timeout={2000} onExit={() => this.renderExitTransition('default')} onEnter={() => this.renderEnterTransition('default')}>
                  <Route exact path="/credits" component={ Credits } />
                </Transition>
                      */}
                                        
                                        
                      {/* <Route exact path="/chapter-1" component={ Chapter1 } />
                      <Route exact path="/chapter-2" component={ Chapter2 } />
                      <Route exact path="/outro" component={Outro} />
                      <Route exact path="/about" component={About} />
                      <Route exact path="/credits" component={Credits} /> 
                    </Switch> */}
                  {/* </Transition>*/}*/}
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
