import React from "react";
import {connect} from 'react-redux';
import { getCurrentInfos } from '~/services/stores/reducers/selectors';

class Info extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <>
        {this.props.infos.map(info => (
          <div key={info.id} className="InfoPoint">
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
