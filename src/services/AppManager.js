import assetsManager from "./loaders/AssetsManager";
import { store } from './stores/store'
import { fetchChapters, fetchSteps } from './stores/actions'
import { getChapter } from './stores/reducers/selectors'
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

  loadFromPath(path) {
    if (path.indexOf('chapter') > 0) {
      const localId = path.match(/\d+/g).map(Number)[0];
      // const chapter = getChapter(store.getState(), localId);
      const chapterId = 13;

      this.getChapterSteps(chapterId);
    }
  }
}


export default new AppManager();
