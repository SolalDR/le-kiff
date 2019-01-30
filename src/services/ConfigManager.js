import Bus from "~/helpers/Bus";

class ConfigManager {
  constructor(){
    this.config = null;
  }

  updateConfig(config) {
    this.config = config;
    Bus.dispatch("config:update");
  }
}

export default new ConfigManager();
