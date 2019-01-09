import Event from "./Event";

class Bus extends Event {

  constructor(){
    super();
    this.verboseLevel = 0;
    this.group = new Map();
    this.state = {
      lastIsBus: false
    }

    this.consoleLog = console.log

    console.log = (...args)=>{
      this.state.lastIsBus = false;
      console.groupEnd("Bus");
      this.consoleLog.apply(console, args)
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
      if( !this.state.lastIsBus ){ console.group("Bus"); }


      var group = content.match( /^(.+?)[\-\:]/ )[1];
      var style = group && this.group.get(group) ? this.group.get(group).join(';') : ``;
      this.consoleLog("%c" + "--".repeat(verboseLevel) + " " + content, style);

      this.state.lastIsBus = true;
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
