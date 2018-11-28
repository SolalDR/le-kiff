import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { Component } from 'react';
import Chapter1 from "./pages/Chapter1/Chapter";
import Intro from "./pages/Intro/Intro";
import Outro from "./pages/Outro/Outro";
import Header from "./components/Header/Header";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Header />
          <div className="app__content">
            <Route path="/intro" component={Intro} />
            <Route path="/chapter-1" component={Chapter1} />
            <Route path="/outro" component={Outro} />
          </div> 
        </div>
      </Router>
    );
  }
}

export default App;
