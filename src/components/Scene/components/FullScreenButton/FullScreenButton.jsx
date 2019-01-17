import React from "react";
import "./styles.sass";
import logo from "./logo.svg"

class FullScreenButton extends React.Component {

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
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); 
      }
    }
  };

  render(){
    return (
      <div className="fullscreen-button"
            onClick={this.handleClick}
            ref={(ref) => this.myRef = ref}> 
        <img src={logo} alt=""/>
      </div>
    )
  }

}

export default FullScreenButton;
