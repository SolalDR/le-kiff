import Bus from "~/helpers/Bus";

class AbilitiesManager {

  /**
   * @constructor
   */
  constructor(){
    this.abilities = {
      changeScale: true,
      changeStep: true,
      selectInfo: true
    }
  }

  /**
   * 
   * @param {string} name The ability name 
   * @param {boolean} value The new value (default is null)
   * @return {boolean} 
   */
  can(name = "all", value = null){
    if( name instanceof Array ){

      var abilities = {};
      name.forEach(n => {
        if( value !== null ){
          this.abilities[n] = value
        }
        abilities[n] = this.abilities[n];
      })
      Bus.dispatch("abilities:update", this.abilities);
      return abilities
    
    } else {

      if( name === "all" ){
        return this.can(Object.keys(this.abilities), value);
      }

      if( value !== null ){
        this.abilities[name] = value;
      }
      Bus.dispatch("abilities:update", this.abilities);
      return this.abilities[name]

    }
  }
} 

export default new AbilitiesManager();
