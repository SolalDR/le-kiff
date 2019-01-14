import Bus from "~/helpers/Bus";
class ConfigManager {
  constructor(){
    this.config = null;
  }

  updateConfig(config) {
    Bus.verbose("config:update");
    this.config = config;
  }
}

export default new ConfigManager();
