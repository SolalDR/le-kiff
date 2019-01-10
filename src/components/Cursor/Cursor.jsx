import React from "react";
import PropTypes from 'prop-types';
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
    }

  }
  
  componentDidMount() {
    window.addEventListener("mousemove", this.onMouseMove, { passive: true });
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
  
  onMouseMove = throttle(e => {
    this.target = {
      x: e.clientX,
      y: e.clientY
    };
  }, 10);

  render() {
    const isLoading = this.props.isLoading ? 'is-loading' : '';
    return (
      <div className={`cursor ${isLoading}`} ref={this.cursor}>
          <span className="cursor__bullet"></span>
          <div class="cursor__circle">
            <svg class="cursor__stroke cursor__fill">
              <circle stroke-width="1" fill="none"></circle>
            </svg>
          </div>
          <span className="cursor__text cursor__loading small">Loading</span>
          <span className="cursor__text cursor__hold small">Maintenez pour continuer</span>
      </div>
    )
  }

}

export default Cursor;
