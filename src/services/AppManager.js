import assetsManager from "./loaders/AssetsManager";
import globalDatas from "./../datas/global.json";
import { store } from './stores/store'
import { fetchChapters, fetchSteps } from './stores/actions'
import Api from "./Api";

class AppManager {
  constructor(){
    this.api = new Api({ url:'http://le-kiff.bastiencornier.com/wp-json/v1' });

    assetsManager.loader.addGroup(globalDatas);
    assetsManager.loader.loadGroup("global");

    this.initApi();
  }

  initApi() {
    this.api.get('chapters').then(response => {
      store.dispatch(fetchChapters(response.data));
    })

    // this.getChapterSteps(13);
   
  }

  getChapterSteps(id) {
    this.api.get(`chapters/${id}/steps`).then(response => {
      store.dispatch(fetchSteps(response.data, id));
    })
  }
}


export default new AppManager();
