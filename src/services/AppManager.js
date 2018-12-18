import AssetsManager from "./assetsManager/AssetsManager";
import { store } from './stores/store'
import { fetchChapters, fetchSteps, setLoadedStep } from './stores/actions'
import { getChapterApiId, getIsLoadedChapters } from './stores/reducers/selectors'
import Api from "./Api";
import globalDatas from "./../datas/global.json";
import chapter1Datas from "./../datas/chapter-1.json";


class AppManager {
  constructor(){
    this.api = new Api({ url:'https://le-kiff.bastiencornier.com/wp-json/v1' });

    this.initApi();
    this.initAssets();
    this.waitingRequests = [];

    AssetsManager.loader.loadGroup("global");
    AssetsManager.loader.loadGroup("chapter-1");

    this.unsubscribe = store.subscribe( () => {
      this.executeWaitingRequests();
    })
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
      const apiRequest = (localId) => {
        const chapterId = getChapterApiId(store.getState(), localId);
        this.getChapterSteps(chapterId);
      };

      if (getIsLoadedChapters(store.getState())) {
        apiRequest(localId);
      } else {
        this.waitingRequests.push({
          request: apiRequest, 
          params: localId
        });
      }
    }
  }

  executeWaitingRequests() {
    const state = store.getState();
    if (state.entities.chaptersLoaded && this.waitingRequests.length) {
      this.waitingRequests.forEach(request => {
        request.request(request.params);
      });
      this.unsubscribe();
    }
  }
}


export default new AppManager();
