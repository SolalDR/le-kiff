import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { Component } from 'react';
import Chapter1 from "./components/chapter1/Chapter";
import Intro from "./components/Intro";
import Outro from "./components/Outro";

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">   
          <Route path="/intro" component={Intro} />
          <Route path="/chapter-1" component={Chapter1} />
          <Route path="/outro" component={Outro} />
        </div>
      </Router>
    );
  }
}

export default App;
