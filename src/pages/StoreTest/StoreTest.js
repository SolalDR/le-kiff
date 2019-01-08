import React from "react";
import { connect } from 'react-redux';
import { fetchChapters, fetchSteps } from '../../services/stores/actions';

// TODO Delete when unused
class StoreTest extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  
  handleClickChapters () {
    this.props._addChapters([
      {
        id: 500,
        test: 'chapter 1 '
      },
      {
        id: 750,
        test: 'chapter 2'
      }
    ]);
  }

  handleClickSteps () {
    this.props._addSteps([
      {
        id: 250,
        test: 'Etape 1.'
      },
      {
        id: 565,
        test: 'Etape 2'
      }
    ]);
  }


  render() {
    return (
      <div className="store-test">
        <br></br>
        <br></br>
        <br></br>
        <h1>Ceci est un écran de chargement, les petites requests vers l'API vont se faire tout gentiment</h1><br></br>
        <div>
          <h1>Chapters </h1>
          <p>Store : <code>{JSON.stringify(this.props.chapters)}</code></p>
        </div>
        <hr></hr>
        <div>
          <h1>Steps </h1>
          <p>Store : <code>{JSON.stringify(this.props.steps)}</code></p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    chapters: state.entities.chapters,
    steps: state.entities.steps,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _addChapters: chapters => {
      dispatch(fetchChapters(chapters));
    },
    _addSteps: steps => {
      dispatch(fetchSteps(steps));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreTest);
