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

    this.infos = [
      {scale: 'micro', title: 'Molécule'},
      {scale: 'human', title: 'Humain'},
      {scale: 'macro', title: 'Planète'}
    ];
  }

  /**
   * Callback to parent
   */
  handleClick = (scaleName) => {
    //SoundManager.play(['toggle_default_sound', 'woosh_sound']); 
    SoundManager.play([
      ['ui_sounds', 'toggle_default'], 
      ['ui_sounds', 'woosh'], 
    ]); 
    
    
    this.props.onSelectCallback(scaleName);
  }

  /**
   * @param {string} scale The scale represented
   */
  computeClassName(scale){
    return scale === this.props.scale ? 
      "scale-menu__item is-active" : 
      "scale-menu__item";
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

  renderScaleItem() {
    return this.infos.map((item, index) => {
      const rank = index + 1;
      return (<button 
        key={`scale-menu${index}`}
        className={this.computeClassName(item.scale)}
        onMouseOver={() => this.onMouseOver(rank)}
        onMouseOut={this.onMouseOut.bind(this)}
        onClick={this.handleClick.bind(this, item.scale)}>
          <LetterReveal text={item.title} class={'scale-menu__text heading-8'} duration={0.15} delay={0.025} reveal={(this.state.revealed === rank) || (this.props.scale == item.scale) ? true : false} />
      </button>)
    })
  }

  render(){
    return (
      <div className="scale-menu">
        {this.renderScaleItem()}
      </div>
    )
  }
}

export default ScaleMenu;
