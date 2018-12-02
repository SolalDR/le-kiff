import API from "./api"
import assetsManager from "./loaders/AssetsManager";
import globalDatas from "./../datas/global.json";


class AppManager {
  constructor(){
    assetsManager.loader.addGroup(globalDatas);
    assetsManager.loader.loadGroup("global");

    assetsManager.loader.on("load:earth", ()=>{
      
    })
  }
  
}


export default new AppManager();
