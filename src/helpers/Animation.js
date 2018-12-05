import easing from "./maths/Easing"
import Event from "./Event"

export default class Animation extends Event {

  constructor({
    from = 0,
    to = 0,
    speed = 0.01,
    duration = 1000,
    timingFunction = "linear"
  } = {}){
    super();
    this.start = false;
    this.ended = false;
    this.current = 0;
    this.from = from;
    this.to = to;
    this.speed = speed;
    this.duration = duration;
    this.timingFunction = easing[timingFunction];

    if( arguments[0] && (arguments[0]).speed ){
      this.duration = (Math.abs(this.to - this.from) / speed) * 16;
    }
    
  }

  render(delta){
    if( this.ended ) return;
    if( !this.isStart ){
      this.isStart = true;
      this.dispatch("start");
    }

    this.current += delta;
    this.advancement = this.timingFunction(Math.min(1., this.current/this.duration));
    var value = this.from + (this.to - this.from) * this.advancement;

    this.dispatch("progress", { advancement: this.advancement, value, animation: this });

    if( this.onProgress ) this.onProgress(this.advancement, value, this);
    if( this.advancement === 1 ) {
      this.ended = true;
      this.dispatch("end");
    }

    return this.advancement;
  }
}
