import Event from "./Event";
import {Vector2} from "three";

class Viewport extends Event {
  constructor(){
    super();
    this.update();
    window.addEventListener("resize", this.onResize.bind(this));
  }

  update(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.widthHalf = this.width/2;
    this.heightHalf = this.height/2;

    this.ratio = this.width/this.height;
  }

  transformUnit(inVec, outVec = new Vector2()){
    outVec.x = ( inVec.x * this.widthHalf ) + this.widthHalf;
    outVec.y = -( inVec.y * this.heightHalf ) + this.heightHalf;
    return outVec;
  }

  onResize(){
    this.update();
    this.dispatch("resize");
  }
}

export default new Viewport();
