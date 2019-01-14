import React from "react";
import LetterReveal from '~/components/LetterReveal/LetterReveal';
import "./styles.sass";
import SoundManager from "~/services/soundManager/SoundManager";

class ScaleMenu extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      scale: props.scale,
      revealed: null
    };
  }

  /**
   * Callback to parent
   */
  handleClick = (scaleName) => {
    SoundManager.play(['toggle_default', 'woosh_sound']); 
    this.props.onSelectCallback(scaleName);
  }

  /**
   * @param {string} scale The scale represented
   */
  computeClassName(scale){
    return scale === this.props.scale ? 
      "scale-menu__link scale-menu__link--active" : 
      "scale-menu__link";
  }

  onMouseOver(rank) {
    this.setState({
      revealed: rank
    })
  }

  onMouseOut() {
    this.setState({
      revealed: null
    })
  }
  render(){
    return (
      <div className="scale-menu">
        {/* <LetterReveal text='Molécules' onClick={this.handleClick.bind(this, "micro")} reveal={true} /> */}
        <button 
          className={this.computeClassName("micro")}
          onMouseOver={() => this.onMouseOver(1)}
          onMouseOut={this.onMouseOut.bind(this)}
          onClick={this.handleClick.bind(this, "micro")}>
            <LetterReveal text='Molécules' class={'scale-menu__text heading-4'} onClick={this.handleClick.bind(this, "micro")} duration={0.15} delay={0.025} reveal={(this.state.revealed === 1) || (this.state.scale == 'micro') ? true : false} />
        </button>
        <button 
          className={this.computeClassName("human")}
          onMouseOver={() => this.onMouseOver(2)}
          onMouseOut={this.onMouseOut.bind(this)}
          onClick={this.handleClick.bind(this, "human")} >
          <LetterReveal text='Humain' class={'scale-menu__text heading-4'} onClick={this.handleClick.bind(this, "micro")} duration={0.15} delay={0.025} reveal={(this.state.revealed === 2) || (this.state.scale == 'human') ? true : false} />
        </button>
        <button 
          className={this.computeClassName("macro")}
          onMouseOver={() => this.onMouseOver(3)}
          onMouseOut={this.onMouseOut.bind(this)}
          onClick={this.handleClick.bind(this, "macro")} >
          <LetterReveal text='Mondiale' class={'scale-menu__text heading-4'} onClick={this.handleClick.bind(this, "micro")} duration={0.15} delay={0.025} reveal={(this.state.revealed === 3) || (this.state.scale == 'macro') ? true : false} />
        </button>
      </div>
    )
  }

}

export default ScaleMenu;
