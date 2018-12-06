import React from "react";
import {connect} from 'react-redux';
import { getCurrentInfos } from '~/services/stores/reducers/selectors';

class Info extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    console.log('Class: Info, Function: render, Line 12 this.props.infos(): '
    , this.props.infos);
    return (
      <>
        {this.props.infos.map(info => (
          <div className="InfoPoint">
          <h3 className="InfoPoint__title">{info.title}</h3>
          <div className="InfoPoint__text">{info.content}</div>
          </div>
        ))}
      </>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    infos: getCurrentInfos(state)
  }
};

export default connect(mapStateToProps)(Info);
