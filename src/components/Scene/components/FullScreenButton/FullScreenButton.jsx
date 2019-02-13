import React from "react";
import "./styles.sass";
import full_screen_1366 from "./ui/full_screen_1366.svg";
import full_screen_1920 from "./ui/full_screen_1920.svg";
import full_screen_2560 from "./ui/full_screen_2560.svg";

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
        <picture>
          <source media="(max-width: 2100px)" srcset={full_screen_2560} />
          <source media="(min-width: 1600px)" srcset={full_screen_1920} />
          <img src={full_screen_1366} alt="" />
        </picture>
      </div>
    )
  }

}

export default FullScreenButton;
