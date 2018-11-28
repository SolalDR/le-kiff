import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { Component } from 'react';
import Chapter1 from "./pages/Chapter1/Chapter";
import Intro from "./pages/Intro/Intro";
import Outro from "./pages/Outro/Outro";

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
