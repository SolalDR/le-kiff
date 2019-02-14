import React from "react";
import LetterReveal from '~/components/LetterReveal/LetterReveal';
import "./styles.sass";
import SoundManager from "~/services/soundManager/SoundManager";
import { TimelineLite } from 'gsap';
import CSSRulePlugin from "gsap/CSSRulePlugin";

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

    this.timeline =  new TimelineLite();
  }

  componentDidMount() {
    this.timelineItemsTexts = document.querySelectorAll('.scale-menu__text');
    this.timeline.set( this.timelineItemsTexts, {opacity: 0});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show && nextProps.show) {
      this.timeline.to( CSSRulePlugin.getRule('.scale-menu__item:before'), .5, { transform: 'translateY(-50%) scale(1)'}, 2);
      this.timeline.to(  this.timelineItemsTexts, .3,  { opacity: 1, transform: 'translateY(-50%) translateX(0)'}, 1.5);
    }
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
    return (scale === this.props.scale) ? 
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
        className={`scale-menu__item ${this.props.scale === item.scale ? 'is-active' : ''}`}
        onMouseOver={() => this.onMouseOver(rank)}
        onMouseOut={this.onMouseOut.bind(this)}
        onClick={this.handleClick.bind(this, item.scale)}>
          <LetterReveal text={item.title} class={'scale-menu__text heading-8'} duration={0.3} delay={0.015} reveal={(this.props.show && (this.state.revealed === rank) || (this.props.scale == item.scale && !this.state.revealed )) ? true : false} />
      </button>)
    })
  }

  render(){
    return (
      <div className={`scale-menu`}>
        {this.renderScaleItem()}
      </div>
    )
  }
}

export default ScaleMenu;
