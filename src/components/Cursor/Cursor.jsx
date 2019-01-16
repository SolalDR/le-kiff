import React from "react";
import PropTypes from 'prop-types';
import LetterReveal from '~/components/LetterReveal/LetterReveal'
import "./styles.sass";
import throttle from '~/helpers/throttle';
import Bus from "../../helpers/Bus";

class Cursor extends React.Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    indication: PropTypes.bool,
    isHoldAllowed: PropTypes.bool,
    onHoldComplete: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.cursor = React.createRef();

    this.width = 0;
    this.bulletWidth = 0;

    this.counter = 0;
    this.holdDuration = 62;
    this.isHoldComplete = false;
    this.timerID = null;

    this.cursorNotMovingTimeout = null;
    this.target = {
      x: 0,
      y: 0
    };

    this.position = {
      x: 0,
      y: 0
    };

    this.state = {
      isHolding: false,
      isIndicating: true,
      isCursorStill: false
    }

  }
  
  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    window.addEventListener('mouseleave', this.onMouseUp.bind(this), false);

    this.update();
  }

  componentWillUnmount() {
    clearTimeout(this.cursorNotMovingTimeout);
    window.cancelAnimationFrame(this.update);
    window.cancelAnimationFrame(this.timer);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("mouseleave", this.mouseleave);

    if (this.bullet) {
      this.bullet.removeEventListener('animationend', this.onCursorTransitionEnd);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isHoldAllowed !== this.props.isHoldAllowed) {
        if (nextProps.isHoldAllowed) {
          Bus.verbose("cursor:click&hold-allowed");
        } else {
          Bus.verbose("cursor:click&hold-not-allowed");
        }
    }
  }

  onCursorTransitionEnd() {
    if (this.isHoldComplete) {
      this.cursor.current.classList.remove('is-hold');
      this.isHoldComplete = false;
    }
  }

  update = () => {
    window.requestAnimationFrame(this.update);

    if (this.cursor.current && !this.width) {
      this.width = this.cursor.current.clientWidth / 2;
      this.bullet = this.cursor.current.querySelector('.cursor__bullet');
      this.bullet.addEventListener('animationend', this.onCursorTransitionEnd.bind(this));
      this.bulletWidth = this.bullet.clientWidth / 2;
    }
      
    this.position.x += (this.target.x - this.position.x - this.width) * 0.7;
    this.position.y += (this.target.y - this.position.y - this.width) * 0.7;

    if (this.cursor.current) {
      this.cursor.current.style.transform = `translate3d(${
        this.position.x
      }px, ${this.position.y}px,0)`;
    }
  };

  timer() {
    if (this.counter < this.holdDuration) {
      this.timerID = requestAnimationFrame(this.timer.bind(this));
      this.counter++;
    } else {
      Bus.verbose("cursor:click&hold-done");
      this.isHoldComplete = true;
      this.props.onHoldComplete();
    }
  }
  
  onMouseMove = throttle(e => {
    if (this.state.isCursorStill) {
      this.setState({
        isCursorStill: false
      })
    }

    clearTimeout(this.cursorNotMovingTimeout);
    this.cursorNotMovingTimeout = setTimeout(this.onCursorNotMoving.bind(this), 1500);

    this.target = {
      x: e.clientX,
      y: e.clientY
    };
  }, 15);

  onMouseDown(e) {
    if (this.props.isHoldAllowed) {
      this.cursor.current.classList.add('is-hold');
      requestAnimationFrame(this.timer.bind(this));
      
      e.preventDefault();
    }
  }

  onMouseUp() { 
    if (this.counter < this.holdDuration) {
      if (this.cursor.current) {
        this.cursor.current.classList.remove('is-hold');
      }
      this.isHoldComplete = false;
    }
    this.counter = 0;
    
    cancelAnimationFrame(this.timerID);
  }

  onCursorNotMoving() {
    this.setState({
      isCursorStill: true
    })
  }

  render() {
    const isLoading = this.props.isLoading ? 'is-loading' : '';
    return (
      <div className={`cursor ${isLoading}`} ref={this.cursor}>
          <span className="cursor__bullet"></span>
          <div className="cursor__circle">
            <svg className="cursor__stroke cursor__fill">
              <circle strokeWidth="1" fill="none"></circle>
            </svg>
          </div>
          <LetterReveal text="Loading" class={'cursor__text cursor__loading small'} duration={0.3} delay={0.025} globalDelay={4} reveal={this.props.isLoading} start={{top: 15}} />
          <LetterReveal text="Maintenez pour continuer" class={'cursor__text cursor__hold small'} duration={0.15} delay={0.025} reveal={!this.props.isLoading && this.state.isCursorStill && this.props.isHoldAllowed} />
      </div>
    )
  }

}

export default Cursor;
