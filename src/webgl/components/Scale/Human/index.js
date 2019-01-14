import Scale from "../Scale";

class HumanScale extends Scale {
 
  /**
   * @constructor
   * @param {THREE.Scene} args.scene
   */
  constructor(args){
    super({...args, name: "human"});
    this.state = {
      ...this.state
    }
    
    this.init();
  }

  display( previous, next ){
    super.display( this.config.transitions[previous] );
  }

  hide( previous, next ){
    console.log(this.config, this.config.transitions[next]);
    super.hide( this.config.transitions[next] );
  }

  
  init(){
    super.init();
  }

  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
  }
}

export default HumanScale;
