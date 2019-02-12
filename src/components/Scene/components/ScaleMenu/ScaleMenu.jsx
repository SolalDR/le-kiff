import React from "react";
import PropTypes from 'prop-types';

import LetterReveal from '~/components/LetterReveal/LetterReveal';
import "./styles.sass";
import SoundManager from "~/services/soundManager/SoundManager";
import AbilitiesManager from "../../../../services/AbilitiesManager";

class ScaleMenu extends React.Component {

  static propTypes = {
    step: PropTypes.shape({
      scale: PropTypes.number,
      chapter_id: PropTypes.string,
      onSelectCallback: PropTypes.func,
      showTutorial: PropTypes.bool
    })
  }


  constructor(props){
    super(props);
    this.state = {
      scale: props.scale,
      revealed: null,
      showTutorial: props.showTutorial
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
    if( !AbilitiesManager.can("changeScale")) return;
    //SoundManager.play(['toggle_default_sound', 'woosh_sound']);
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
        className={this.computeClassName(item.scale)}
        onMouseOver={() => this.onMouseOver(rank)}
        onMouseOut={this.onMouseOut.bind(this)}
        onClick={this.handleClick.bind(this, item.scale)}>
          <LetterReveal text={item.title} class={'scale-menu__text heading-8'} duration={0.3} delay={0.015} reveal={(this.state.revealed === rank) || (this.props.scale == item.scale && !this.state.revealed ) ? true : false} />
      </button>)
    })
  }

  render(){
    return (
      <div className="scale-menu">
        {this.renderScaleItem()}
        <div className={`scale-menu__tutorial ${this.state.showTutorial ? '' : 'is-hidden'}`}>
          <p className="teasing-3"><span className="scale-menu__tutorial__item">Feel free to switch point of views</span> <span className="scale-menu__tutorial__item">to look beyond or to go deeper, at </span><span className="scale-menu__tutorial__item">any time.</span> </p>
          <svg width="29" height="50" xmlns="http://www.w3.org/2000/svg" className="scale-menu__tutorial__icon">
            <g fill="none" fillRule="evenodd">
              <rect stroke="#FFF" x=".5" y=".5" width="28" height="49" rx="14"/>
              <g className="scale-menu__tutorial__icon__circle">
                <circle fill="#FFF" cx="15" cy="10" r="3"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    )
  }
}

export default ScaleMenu;
