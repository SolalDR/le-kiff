import Event from "~/helpers/Event";
import Bus from "~/helpers/Bus";

class History extends Event {

  constructor(){
    super();
    this.chapters = new Map();
    this.steps = new Map();
  }

  registerChapter(id){
    if( !this.chapters.has(id) ) {
      this.chapters.set(id, new Map());
    } 
    this.dispatch("register:chatper", id);
  }

  registerStep(step){
    if( !this.chapters.has(step.chapter_id) ) this.registerChapter(step.chapter_id);
    this.chapters.get(step.chapter_id).set(step.id, step);
    this.steps.set(step.id, step);
    Bus.dispatch("history:register-step", step, 2);
    this.dispatch("register:step", step);
  }

  getStep(id){
    return this.steps.get(id);
  }

}

export default new History();
