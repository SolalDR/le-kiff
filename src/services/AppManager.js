import AssetsManager from "./assetsManager/AssetsManager";
import { store } from './stores/store'
import { fetchChapters, fetchSteps, setLoadedStep } from './stores/actions'
import { getChapter } from './stores/reducers/selectors'
import Api from "./Api";
import globalDatas from "./../datas/global.json";
import chapter1Datas from "./../datas/chapter-1.json";


class AppManager {
  constructor(){
    this.api = new Api({ url:'http://le-kiff.bastiencornier.com/wp-json/v1' });

    this.initApi();
    this.initAssets();

    AssetsManager.loader.loadGroup("global");
    AssetsManager.loader.loadGroup("chapter-1");
  }

  initApi() {
    this.api.get('chapters').then(response => {
      const isLoaded = response.status === 200;
      store.dispatch(fetchChapters(response.data, isLoaded));
    })
  }

  initAssets(){
    AssetsManager.loader.addGroup(globalDatas);
    AssetsManager.loader.addGroup(chapter1Datas);
  }

  getChapterSteps(id) {
    this.api.get(`chapters/${id}/steps`).then(response => {
      const isLoaded = response.status === 200;
      store.dispatch(fetchSteps(response.data, id));
      
      if (isLoaded) store.dispatch(setLoadedStep(id));
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
