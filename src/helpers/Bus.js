import Event from "./Event";

class Bus extends Event {

  constructor(){
    super();
    this.verboseLevel = 0;
  }

  dispatch(arg1, event, verboseLevel = 1 ) {
    this.verbose(arg1, verboseLevel);
    super.dispatch(arg1, event);
  }

  verbose(content, verboseLevel = 1){
    if( this.verboseLevel >= verboseLevel ) console.log("--".repeat(verboseLevel) + " " + content);
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
