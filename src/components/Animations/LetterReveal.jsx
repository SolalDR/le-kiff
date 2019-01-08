import React from "react";
import PropTypes from 'prop-types';
import { TweenMax } from 'gsap';
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reveal !== this.props.reveal) {
      this.isRevealed ?
        this.unReveal() : this.reveal();
    }
  }

  reveal() {
    TweenMax.staggerFromTo(
      this.letterEls,
      this.props.duration,
      { opacity: 0, top: 30 },
      { opacity: 1, top: 0 },
      this.props.delay
    );
    this.isRevealed = true;
  }

  unReveal() {
    TweenMax.staggerFromTo(
      this.letterEls,
      this.props.duration,
      { opacity: 1, top: 0 },
      { opacity: 0, top: 30 },
      this.props.delay
    );
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
