import assetsManager from "./loaders/AssetsManager";
import globalDatas from "./../datas/global.json";
import Api from "../../services/Api";

class AppManager {
  constructor(){
    assetsManager.loader.addGroup(globalDatas);
    assetsManager.loader.loadGroup("global");
  }
}


export default new AppManager();
