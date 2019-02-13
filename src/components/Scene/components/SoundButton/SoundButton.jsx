import React from "react";
import "./styles.sass";
import SoundManager from "~/services/soundManager/SoundManager";
import son_1366 from "./ui/son_1366.svg";
import son_1920 from "./ui/son_1920.svg";
import son_2560 from "./ui/son_2560.svg";

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
             <picture>
              <source media="(max-width: 2100px)" srcset={son_2560} />
              <source media="(min-width: 1600px)" srcset={son_1920} />
              <img src={son_1366} alt="" />
            </picture>
      </div>
    )
  }

}

export default SoundButton;
