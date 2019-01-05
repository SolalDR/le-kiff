import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppManagerHydrator from './components/AppManagerHydrator/AppManagerHydrator';
import Chapter1 from "./pages/Chapter1/Chapter";
import Intro from "./pages/Intro/Intro";
import Outro from "./pages/Outro/Outro";
import StoreTest from "./pages/StoreTest/StoreTest";
import Header from "./components/Header/Header";
import AppManager from "./services/AppManager.js"
import { store } from './services/stores/store';
import "./styles/app.sass";

class App extends Component {

  constructor(props){
    super(props);
    this.manager = AppManager;

    this.state = {
      chapterLoaded: false,
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
              <Route exact path="/chapter-1" component={Chapter1} />
              <Route exact path="/outro" component={Outro} />
              <Route exact path="/store-test" component={StoreTest} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
