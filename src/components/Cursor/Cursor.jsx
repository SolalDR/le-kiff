import React from "react";
import "./styles.sass";
import throttle from '~/helpers/throttle';

class Cursor extends React.Component {

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

    this.position.x += (this.target.x - this.position.x) * 0.9;
    this.position.y += (this.target.y - this.position.y) * 0.9;

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
      <div className="cursor" ref={this.cursor}>
      </div>
    )
  }

}

export default Cursor;
