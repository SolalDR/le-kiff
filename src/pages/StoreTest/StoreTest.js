import React from "react";
import { connect } from 'react-redux';
import { addChapters, addInfos, addSteps } from '../../services/stores/actions';

class StoreTest extends React.Component {
    
  constructor() {
    super();
    this.state = {};
  }

  
  handleClickChapters () {
    this.props._addChapters([
      {
        api_id: '500',
        test: 'chapter 1 '
      },
      {
        api_id: '750',
        test: 'chapter 2'
      }
    ]);
  }

  handleClickInfos () {
    this.props._addInfos([
      {
        api_id: '850',
        test: 'La feuille est cultivée depuis 5000 ans.'
      },
      {
        api_id: '750',
        test: 'Le crack arrive à Stalingrad.'
      }
    ]);
  }

  handleClickSteps () {
    this.props._addSteps([
      {
        api_id: '250',
        test: 'Etape 1.'
      },
      {
        api_id: '565',
        test: 'Etape 2'
      }
    ]);
  }


  render() {
    return (
      <div className="store-test">
        <div>
          <h1>Chapters </h1>
          <button onClick={this.handleClickChapters.bind(this)}> Ajouter Chapitres au store </button>
          <p>Store : <code>{JSON.stringify(this.props.chapters)}</code></p>
        </div>
        <hr></hr>
        <div>
          <h1>Infos </h1>
          <button onClick={this.handleClickInfos.bind(this)}> Ajouter Infos au store </button>
          <p>Store : <code>{JSON.stringify(this.props.infos)}</code></p>
        </div>
        <hr></hr>
        <div>
          <h1>Steps </h1>
          <button onClick={this.handleClickSteps.bind(this)}> Ajouter Steps au store </button>
          <p>Store : <code>{JSON.stringify(this.props.steps)}</code></p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    chapters: state.entities.chapters,
    infos: state.entities.infos,
    steps: state.entities.steps
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _addChapters: chapters => {
      dispatch(addChapters(chapters));
    },
    _addInfos: infos => {
      dispatch(addInfos(infos));
    },
    _addSteps: steps => {
      dispatch(addSteps(steps));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreTest);
