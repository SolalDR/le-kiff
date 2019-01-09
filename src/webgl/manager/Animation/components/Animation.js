import easing from "~/helpers/maths/Easing"
import Event from "~/helpers/Event"

export default class Animation extends Event {

  constructor({
    from = 0,
    to = 0,
    speed = 0.01,
    duration = 1000,
    delay = 0,
    timingFunction = "linear",
    auto = true
  } = {}){
    super();
    this.started = false;
    this.ended = false;
    this.current = 0;
    this.from = from;
    this.to = to;
    this.delay = delay;
    this.speed = speed;
    this.duration = duration;
    this.timingFunction = easing[timingFunction];

    if( arguments[0] && (arguments[0]).speed ){
      this.duration = (Math.abs(this.to - this.from) / speed) * 16;
    }

    if( auto ){
      this.start();
    }
  }

  start(){
    if( this.delay > 0 ){
      setTimeout(()=>{
        this.started = true;
        this.dispatch("start");
      }, this.delay)
      return; 
    }
    this.started = true;
    this.dispatch("start");
  }

  render(delta){
    if( this.ended || !this.started ) return;

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
