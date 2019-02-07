import React from "react";
import "./styles.sass";
import logo from "./son.svg"
import SoundManager from "~/services/soundManager/SoundManager";

class SoundButton extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      active: true
    }
  }

  componentWillReceiveProps(nextProps, previousProps){
  }

  componentDidMount(){
  }


  handleClick = () => {
    if( this.state.active ){
      this.setState({active: false})
      SoundManager.volume = 0;
      return;
    }

    this.setState({active: true})
    SoundManager.volume = 1;
  };

  render(){
    return (
      <div className={ `sound-button ${!this.state.active ? 'is-muted' : ''}` }
            onClick={this.handleClick}
            ref={(ref) => this.myRef = ref}> 
        <img src={logo} alt=""/>
      </div>
    )
  }

}

export default SoundButton;
