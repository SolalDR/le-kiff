import assetsManager from "./loaders/AssetsManager";
import globalDatas from "./../datas/global.json";
import Api from "./Api";

class AppManager {
  constructor(){
    this.api = new Api({ url:'https://le-kiff.bastiencornier.com/wp-json/v1' });

    assetsManager.loader.addGroup(globalDatas);
    assetsManager.loader.loadGroup("global");
  }
}


export default new AppManager();
