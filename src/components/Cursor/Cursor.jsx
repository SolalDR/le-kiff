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
  }

  componenWillUnmount() {
    window.cancelAnimationFrame(this.update);
    window.removeEventListener("mousemove", this.onMouseMove, {
      passive: true
    });
  }

  update = () => {
    window.requestAnimationFrame(this.update);

    this.position.x += (this.target.x - this.position.x) * 0.7;
    this.position.y += (this.target.y - this.position.y) * 0.7;

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
    return (
      <div className="cursor is-loading" ref={this.cursor}>
          <span className="cursor__bullet"></span>
          <span className="cursor__loading small">Loading</span>
      </div>
    )
  }

}

export default Cursor;
