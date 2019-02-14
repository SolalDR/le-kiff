import React from "react";
import PropTypes from 'prop-types';
import { TimelineLite, Expo } from 'gsap';
import "./styles.sass";

class LetterReveal extends React.Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    delay: PropTypes.number.isRequired,
    globalDelay: PropTypes.number,
    reveal: PropTypes.bool.isRequired,
    class: PropTypes.string,
    from: PropTypes.object,
    to: PropTypes.object,
    svg: PropTypes.bool,
    positionSvg: PropTypes.object,
    onCompleteReveal: PropTypes.func,
    reverseEasingUnreveal: PropTypes.bool
  };

  static defaultProps = {
    text: 'Reveal',
    duration: 2,
    delay: 0.05,
    globalDelay: 0,
    reveal: false,
    class: '',
    from: {},
    to: {},
    reverseEasingUnreveal: false,
    onCompleteReveal: () => {}
  }


  constructor(props) {
    super(props);
    this.length = props.text.length;
    this.lettersArray = props.text.split("");
    this.elements = React.createRef();
    this.letterEls = [];

    this.isRevealed = false;
    this.isAnimating = false;

    this.timeline = null;
  }

  componentDidMount() {
    this.initReveal();
  }

  componentWillReceiveProps(nextProps) {
      if (this.isRevealed && !nextProps.reveal) {
        this.unReveal();
      } else if (!this.isRevealed && nextProps.reveal) {
        this.reveal();
      }
  }

  initReveal() {
    if (!this.timeline) {
      this.timeline = new TimelineLite({paused: true, delay: this.props.globalDelay, onReverseComplete: this.offAnimation.bind(this), onComplete: this.offAnimation.bind(this) });
      this.timeline.set(this.letterEls, this.props.from);
    }
    if (this.props.reveal) {
      this.reveal();
    }
  }

  offAnimation() {
    this.isAnimating = false;
    this.timeline.pause();
  }

  reveal() {
    if (!this.isAnimating) {
      this.isAnimating = true;
    
      this.timeline.staggerTo(this.letterEls, this.props.duration, { ease: Expo.easeIn, ...this.props.to }, this.props.delay);
      this.timeline.play();


      this.isRevealed = true;
    }
  }

  unReveal() {
    this.isAnimating = true;
    this.timeline.play();
    this.timeline.staggerTo(this.letterEls, this.props.duration, { ease: this.props.reverseEasingUnreveal ? Expo.easeIn : Expo.easeOut, ...this.props.from }, -(this.props.delay));
    this.isRevealed = false;
  }

  renderLetters() {
    if (this.lettersArray.length) {
      return this.lettersArray.map((item, rank) => {
        if (this.props.svg) {
          return (
            <tspan y={this.props.positionSvg.spanY} className={`letter-reveal__item ${item.indexOf(' ') >= 0 ? 'letter-reveal__space' : ''}`}
            key={rank}
            ref={el => {
              this.letterEls[rank] = el;
            }}>{item}</tspan>
          )
        } else {
          return (
            <span className={`letter-reveal__item ${item.indexOf(' ') >= 0 ? 'letter-reveal__space' : ''}`}
            key={rank}
            ref={el => {
              this.letterEls[rank] = el;
            }}>{item}</span>
          )
        }
      })
    }
  }

  render() {
    return (
      <>
        {
          this.props.svg && 
            <text x={this.props.positionSvg.textX} className={`letter-reveal ${this.props.class}`} baseFrequency="0.005">{this.renderLetters()}</text>
        }

        {
          !this.props.svg && 
          <span className={`letter-reveal ${this.props.class}`}>{this.renderLetters()}</span>
        }
      </>
    )
  }
}

export default LetterReveal;
