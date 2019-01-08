import React from "react";
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';
import "./styles.sass";

class LetterReveal extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    delay: PropTypes.number.isRequired,
    reveal: PropTypes.bool.isRequired
  };

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
      this.timeline = new TimelineLite({paused: true, onReverseComplete: this.offAnimation.bind(this), onComplete: this.offAnimation.bind(this) });
      this.timeline.staggerTo(this.letterEls,
        this.props.duration,
        { opacity: 1, top: 0 },
        this.props.delay);
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

  render() {
    let results = [];
    for (let i = 0; i < this.length; i++) {
      (rank =>
        results.push(
          <span
            className="letter-reveal__item"
            key={rank}
            ref={el => {
              this.letterEls[i] = el;
            }}
          >
            {this.lettersArray[i]}
          </span>
        ))(i);
    }
    return <span className="letter-reveal">{results}</span>;
  }
}

export default LetterReveal;
