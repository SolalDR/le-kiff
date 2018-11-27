import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { Component } from 'react';
import Scene from './components/scene/Scene';
import Chapter1 from "./components/chapters/Chapter1";
import Chapter2 from "./components/chapters/Chapter2";
import Chapter3 from "./components/chapters/Chapter3";
import Chapter4 from "./components/chapters/Chapter4";

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Scene></Scene>
          <Route path="/chapitre/1" component={Chapter1} />
          <Route path="/chapitre/2" component={Chapter2} />
          <Route path="/chapitre/3" component={Chapter3} />
          <Route path="/chapitre/4" component={Chapter4} />
        </div>
      </Router>
    );
  }
}

export default App;
