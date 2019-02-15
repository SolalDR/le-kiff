import React from "react";
import PropTypes from 'prop-types';
import LetterReveal from '~/components/LetterReveal/LetterReveal'
import AbilitiesManager from "~/services/AbilitiesManager";
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
    this.holdDuration = 63;
    this.isHoldComplete = false;
    this.cursorNotMovingTimeout = null;
    this.target = {
      x: 100,
      y: 100
    };

    this.position = {
      x: 100,
      y: 100
    };

    this.state = {
      isHolding: false,
      isIndicating: true,
      isCursorStill: false,
      isLoading: false,
      canChangeStep: true
    }

  }
  
  componentDidMount() {
    this.rootDom.addEventListener('mousemove', this.onMouseMove, { passive: true });
    this.rootDom.addEventListener('mousedown', this.onMouseDown, false);
    this.rootDom.addEventListener('mouseup', this.onMouseUp, false);

    Bus.on("abilities:update", this.updateAbilities);

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
    this.setState({
      isLoading: nextProps.isLoading
    })
  }

  // Events

  /**
   * Triggered when the hold animation is finished 
   */
  onCursorTransitionEnd() {
    if (this.isHoldComplete) {
      this.cursor.current.classList.remove('is-hold');
      this.isHoldComplete = false;
    }
  }

  onMouseDown = (e) => {
    if (e.which != 3 && this.state.canChangeStep) {
      this.setState({ isHolding: true })
      this.cursor.current.classList.add('is-hold');
      e.preventDefault();
      requestAnimationFrame(this.timer);
    }
  }

  onMouseMove = throttle(e => {
    if (this.state.isCursorStill) {
      this.setState({
        isCursorStill: false
      })
    }

    var cursorNotMovingCallback = _ => this.setState({ isCursorStill: true });
    clearTimeout(this.cursorNotMovingTimeout);
    this.cursorNotMovingTimeout = setTimeout(cursorNotMovingCallback, 1500);

    this.target = {
      x: e.clientX,
      y: e.clientY
    };
  }, 15);

  onMouseUp = () => { 
    this.resetHolding();
    this.counter = 0;
  }

  onHoldComplete(){
    Bus.verbose("cursor:click");
    // this.isHoldComplete = true;
    // this.resetHolding();
    this.props.onHoldComplete();
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

  resetHolding(){
    this.setState({ isHolding: false })
    if (this.cursor.current) {
      this.cursor.current.classList.remove('is-hold');
    }
  }

  updateAbilities = (abilities) => {
    if (abilities.changeStep !== this.state.canChangeStep) {
      this.setState({
        canChangeStep: abilities.changeStep
      });
    }
  }


  /**
   * Raf method for displacement animation
   */
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
      this.cursor.current.style.setProperty('--x', this.position.x + "px");
      this.cursor.current.style.setProperty('--y', this.position.y + "px");
    }
  }

  render() {
    const isLoading = this.props.isLoading ? 'is-loading' : '';
    return (
      <div className={`cursor ${isLoading}`} ref={this.cursor}>
          <span className="cursor__bullet"></span>
          <div className="cursor__circle">
            <svg className="cursor__stroke cursor__fill">
              <circle strokeWidth="1" fill="none" r="24.6" cx="25.6" cy="25.6"></circle>
            </svg>
          </div>
          <LetterReveal text="Loading" class={'cursor__text cursor__loading small'} duration={0.2} delay={0.015} globalDelay={4} reveal={this.props.isLoading} from={{y: 15, opacity: 0}} to ={{y: 0, opacity: 1}} />
          <LetterReveal text="Hold to continue" class={'cursor__text cursor__hold small'} duration={0.2} delay={0.015} reveal={ this.state.canChangeStep && ((!this.props.isLoading && this.state.isCursorStill) || (!this.props.isLoading && this.props.isIntro)) } from={{y: 15, opacity: 0}} to ={{y: 0, opacity: 1}} />
      </div>
    )
  }

}

export default Cursor;
