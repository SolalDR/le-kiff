import Event from "./Event";

class Bus extends Event {

  constructor(){
    super();
    this.verboseLevel = 0;
    this.group = new Map();
    this.state = {
      lastIsBus: false
    }
  }

  registerGroup(name, color){
    this.group.set(name, color);
  }

  dispatch(arg1, event, verboseLevel = 1 ) {
    this.verbose(arg1, verboseLevel);
    super.dispatch(arg1, event);

  }

  verbose(content, verboseLevel = 1){
    if( this.verboseLevel >= verboseLevel ) {
      var group = content.match( /^(.+?)[\-\:]/ )[1];
      var style = group && this.group.get(group) ? this.group.get(group).join(';') : ``;
      console.log("%c" + "--".repeat(verboseLevel) + " " + content, style);
    }
  }
}

/**
 *  Level 1
 * Global modification
 * 
 *  Level 2 
 * Local modification
 * 
 *  Level 3
 * Local infos
 */

export default new Bus();
