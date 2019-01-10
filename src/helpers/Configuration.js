class Configuration {
  constructor(config){
    Object.keys(config).forEach(key => {
      var value = config[key];
      if(value.constructor.name === "Object") {
        this[key] = new Configuration(value);
      } else {
        this[key] = value;
      }
    })
  }
}

var c = (configuration)=>{
  return new Configuration(configuration);
};


export default c;

