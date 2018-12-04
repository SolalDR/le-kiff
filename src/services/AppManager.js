import assetsManager from "./loaders/AssetsManager";
import { store } from './stores/store'
import { fetchChapters, fetchSteps } from './stores/actions'
import Api from "./Api";
import globalDatas from "./../datas/global.json";
import chapter1Datas from "./../datas/chapter-1.json";


class AppManager {
  constructor(){
    this.api = new Api({ url:'http://le-kiff.bastiencornier.com/wp-json/v1' });

    this.initApi();
    this.initAssets();

    assetsManager.loader.loadGroup("global");
    assetsManager.loader.loadGroup("chapter-1");
  }

  initApi() {
    this.api.get('chapters').then(response => {
      store.dispatch(fetchChapters(response.data));
    })

    this.getChapterSteps(13);
  }

  initAssets(){
    assetsManager.loader.addGroup(globalDatas);
    assetsManager.loader.addGroup(chapter1Datas);
  }

  getChapterSteps(id) {
    this.api.get(`chapters/${id}/steps`).then(response => {
      store.dispatch(fetchSteps(response.data, id));
    })
  }
}


export default new AppManager();
