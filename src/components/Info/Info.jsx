import React from "react";
import {connect} from 'react-redux';
import { getCurrentInfos } from '~/services/stores/reducers/selectors';

class Info extends React.Component {

  constructor(props){
    super(props);
    this.toggleClass= this.toggleClass.bind(this);
    this.state = {
      active: false,
    };
  }

  toggleClass() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  render(){
    return (
      <>
        {this.props.infos.map(info => (
          <div key={info.id}
               className={"InfoPoint " + (this.state.active ? 'InfoPoint--open': null)}
               onClick={this.toggleClass}
          >
          <div className="InfoPoint__pointer"/>
            <div className="InfoPoint__content">
              <h3 className="InfoPoint__title">{info.title}</h3>
              <div className="InfoPoint__text" dangerouslySetInnerHTML={{__html: info.content}} />
            </div>
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
