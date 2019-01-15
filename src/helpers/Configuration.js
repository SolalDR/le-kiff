class Configuration {
  constructor(config, {
    clone = false
  } = {}){

    Object.keys(config).forEach(key => {
      var value = config[key];

      if( value instanceof THREE.Vector3 || value instanceof THREE.Color ) {
        this[key] = value.clone();
      } else if( value instanceof Configuration ){
        this[key] = value.clone();
      } else if( value.constructor === Object ) {
        this[key] = new Configuration(value);
      } else {
        this[key] = value;
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

      // value is already defined
      if (this[key] && this[key] instanceof Configuration) {
        if ( value instanceof Configuration || value.constructor === Object ) {
          this[key].hydrate(value);
        }
        return; 
      }
    
      // Value need to be defined

      // Configuration case
      if( value.constructor === Object) {
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

