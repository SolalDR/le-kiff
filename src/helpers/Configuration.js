class Configuration {
  constructor(config, {
    clone = false
  } = {}){

    Object.keys(config).forEach(key => {
      var value = config[key];

      switch(value.constructor.name) {
        case "Vector3": this[key] = value.clone(); break;
        case "Color": this[key] = value.clone(); break;
        case "Object": this[key] = new Configuration(value); break;
        case "Configuration": this[key] = value.clone(); break;
        default: this[key] = value; break;
      }
    })
  }

  extends(config) {
    var cloned = this.clone();
    cloned.hydrate({...config})
    return cloned;
  }

  clone() {
    return new Configuration({
      ...this,
    }, {
      clone: true
    })
  }
  

  hydrate(config){
    Object.keys(config).forEach(key => {
      var value = config[key];

      if(this[key] && value.constructor.name !== this[key].constructor.name && value.constructor.name !== "Configuration" && value.constructor.name !== "Object") {
        console.error(`Configuration: "${key}" is type "${value.constructor.name}", you may replace it with an instance of "${this[key].constructor.name}"`);
        return; 
      }

      // value is already defined
      if (this[key] && this[key] instanceof Configuration) {
        if ( value instanceof Configuration || value.constructor.name === "Object" ) {
          this[key].hydrate(value);
        }
        return; 
      }
    
      // Value need to be defined

      // Configuration case
      if( value.constructor.name === "Object") {
        this[key] = new Configuration(value);
        return;
      }

      /**
       * Object with clone method
       */
      if( (
        value.clone && value.clone instanceof Function) ||
        value.constructor.prototype.clone 
      ){
        this[key] = value.clone();
      }

      if( value instanceof Configuration ){
        this[key] = value.clone();
        this[key].hydrate()
        return;
      }

      // default primitive type
      this[key] = value;
    })
  }
}

var c = _ => new Configuration(_);

export { c }
export default Configuration;

