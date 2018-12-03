import API from "./api"
import assetsManager from "./loaders/AssetsManager";
import globalDatas from "./../datas/global.json";


class AppManager {
  constructor(){
    assetsManager.loader.addGroup(globalDatas);
    assetsManager.loader.loadGroup("global");
  }
}


export default new AppManager();
