import React from "react";
import PropTypes from 'prop-types';
import LetterReveal from '~/components/LetterReveal/LetterReveal'
import "./styles.sass";
import throttle from '~/helpers/throttle';
import Bus from "../../helpers/Bus";

class Cursor extends React.Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    indication: PropTypes.bool,
    isHoldAllowed: PropTypes.bool,
    onHoldComplete: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.cursor = React.createRef();
    this.rootDom = document.querySelector('#root');

    this.width = 0;
    this.bulletWidth = 0;

    this.counter = 0;
    this.holdDuration = 62;
    this.isHoldComplete = false;
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
    this.rootDom.addEventListener('mousemove', this.onMouseMove, { passive: true });
    this.rootDom.addEventListener('mousedown', this.onMouseDown, false);
    this.rootDom.addEventListener('mouseup', this.onMouseUp, false);

    this.update();
  }

  componentWillUnmount() {

    clearTimeout(this.cursorNotMovingTimeout);
    window.cancelAnimationFrame(this.update);
    window.cancelAnimationFrame(this.timerRAF);
    this.rootDom.removeEventListener("mousemove", this.onMouseMove);
    this.rootDom.removeEventListener("mousedown", this.onMouseDown);
    this.rootDom.removeEventListener("mouseup", this.onMouseUp);

    if (this.bullet) {
      this.bullet.removeEventListener('animationend', this.onCursorTransitionEnd);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isHoldAllowed !== this.props.isHoldAllowed) {
        if (nextProps.isHoldAllowed) {
          Bus.verbose("cursor:click&hold-allowed", 3);
        } else {
          Bus.verbose("cursor:click&hold-not-allowed", 3);
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

  onMouseDown = (e) => {
    if (this.props.isHoldAllowed) {
      this.setState({ isHolding: true })
      this.cursor.current.classList.add('is-hold');
      e.preventDefault();
      requestAnimationFrame(this.timer);
    }
  }

  timer = () => {
    if (this.counter < this.holdDuration) {
      this.counter++;
      if( this.state.isHolding ){
        this.timerRAF = requestAnimationFrame(this.timer);
      }
      return;
    }

    this.onHoldComplete();
    
  }

  onHoldComplete(){
    Bus.verbose("cursor:click");
    // this.isHoldComplete = true;
    // this.resetHolding();
    this.props.onHoldComplete();
  }

  resetHolding(){
    this.setState({ isHolding: false })
    if (this.cursor.current) {
      this.cursor.current.classList.remove('is-hold');
    }
  }

  onMouseUp = () => { 
    this.resetHolding();
    this.counter = 0;
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
