import React from "react";
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';
import "./styles.sass";

class LetterReveal extends React.Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    delay: PropTypes.number.isRequired,
    globalDelay: PropTypes.number,
    reveal: PropTypes.bool.isRequired,
    class: PropTypes.string,
    options: PropTypes.object,
    start: PropTypes.object,
    svg: PropTypes.bool,
    positionSvg: PropTypes.object
  };

  static defaultProps = {
    text: 'Reveal',
    duration: 2,
    delay: 0.05,
    globalDelay: 0,
    reveal: false,
    options: {},
    start: {}
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
    if (nextProps.reveal !== this.props.reveal) {
      if (this.isRevealed && !nextProps.reveal) {
        this.unReveal();
      } else if (!this.isRevealed && nextProps.reveal) {
        this.reveal();
      }
    }
  }

  initReveal() {
    if (!this.timeline) {
      this.timeline = new TimelineLite({paused: true, delay:this.props.globalDelay, onReverseComplete: this.offAnimation.bind(this), onComplete: this.offAnimation.bind(this) });
      this.timeline.set(this.letterEls, this.props.start);
      this.timeline.staggerTo(this.letterEls,
        this.props.duration,
        { opacity: 1, top: 0, ...this.props.options, },
        this.props.delay);
    }
    if (this.props.reveal) {
      this.reveal();
    }
  }

  offAnimation() {
    this.isAnimating = false;
  }

  reveal() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.timeline.play();
      this.isRevealed = true;
    }
  }

  unReveal() {
    this.isAnimating = true;
    this.timeline.reverse();
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
