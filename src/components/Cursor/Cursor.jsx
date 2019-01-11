import React from "react";
import PropTypes from 'prop-types';
import LetterReveal from '~/components/LetterReveal/LetterReveal'
import "./styles.sass";
import throttle from '~/helpers/throttle';

class Cursor extends React.Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    indication: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.cursor = React.createRef();
    this.width = 0;
    this.bulletWidth = 0;
    this.counter = 0;
    this.holdDuration = 40;
    this.timerID = null;

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
      isIndicating: true
    }

  }
  
  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    window.addEventListener('mouseleave', this.onMouseUp.bind(this), false);

    this.update();

    // setTimeout(() => {
    //   this.cursor.current.classList.add('is-hold')
    // }, 5000)
  }

  componenWillUnmount() {
    window.cancelAnimationFrame(this.update);
    window.removeEventListener("mousemove", this.onMouseMove, {
      passive: true
    });
  }

  update = () => {
    window.requestAnimationFrame(this.update);

    if (this.cursor.current && !this.width) {
      this.width = this.cursor.current.clientWidth / 2;
      this.bulletWidth = this.cursor.current.querySelector('.cursor__bullet').clientWidth / 2;
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
    console.log(this.counter, this.holdDuration);
    if (this.counter < this.holdDuration) {
      this.timerID = requestAnimationFrame(this.timer.bind(this));
      this.counter++;
    } else {
      console.log("Press threshold reached!");
      // item.dispatchEvent(pressHoldEvent);
    }
  }
  
  onMouseMove = throttle(e => {
    this.target = {
      x: e.clientX,
      y: e.clientY
    };
  }, 10);

  onMouseDown(e) {
    console.log('mouse down');
    this.cursor.current.classList.add('is-hold');
    requestAnimationFrame(this.timer.bind(this));
    
    e.preventDefault();
  }

  onMouseUp() { 
    if (this.counter < this.holdDuration) {
      this.cursor.current.classList.remove('is-hold');
    }
    this.counter = 0;
    cancelAnimationFrame(this.timerID);
    console.log('mouse up');
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
          <span className="cursor__text cursor__loading small">Loading</span>
          <LetterReveal text="Maintenez pour continuer" class={'cursor__text cursor__hold small'} duration={0.15} delay={0.025} reveal={this.state.isIndicating} />
      </div>
    )
  }

}

export default Cursor;
