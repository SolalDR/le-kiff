import AssetsManager from "./assetsManager/AssetsManager";
import { store } from './stores/store'
import { fetchChapters, fetchSteps, setLoadedStep, setLoadedAssets} from './stores/actions'
import { getChapterApiId, getIsLoadedChapters, getStepsLoaded} from './stores/reducers/selectors'
import Api from "./Api";
import globalDatas from "./../datas/global.json";
import chapter1Datas from "./../datas/chapter-1.json";
import globalSoundsData from "./../datas/sounds/global-sounds.json";
import Bus from "~/helpers/Bus";
import SoundManager from "./soundManager/SoundManager";
import { c } from "../helpers/Configuration";


class AppManager {
  constructor(){
    this.api = new Api({ url:'https://le-kiff.bastiencornier.com/wp-json/v1' });

    this.initApi();
    this.initAssets();
    this.waitingRequests = [];

    AssetsManager.loader.loadGroup("global");
    
    AssetsManager.loader.once("load:global", ()=>{
      AssetsManager.loader.loadGroup("chapter-1");
      Bus.verbose("loader:global");
      store.dispatch(setLoadedAssets('global'));
    })
    
    AssetsManager.loader.on("load:chapter-1", () => {
      Bus.verbose("loader:chapter-1");
      store.dispatch(setLoadedAssets('chapter-1'));
    });
    

    this.addSounds();

    this.unsubscribe = store.subscribe( () => {
      this.executeWaitingRequests();
    })
  }

  initApi() {
    this.api.get('chapters').then(response => {
      Bus.verbose("api:fetch-chapters");
      const isLoaded = response.status === 200;
      store.dispatch(fetchChapters(response.data, isLoaded));
    })
  }

  initAssets() {
    AssetsManager.loader.addGroup(globalDatas);
    AssetsManager.loader.addGroup(chapter1Datas);
  }

  /**
   * add Global App Sounds 
   */
  addSounds() {
    AssetsManager.loader.once("load:global", (event) => {
      const soundsData = [];
      globalSoundsData.forEach(data => {
        data.sound = event[data.name].result
        soundsData.push(data);
      });
      SoundManager.add(soundsData);
    })
  }

  /**
   * Call the API with a promise to get the steps of a chapter
   * @param {Integer} id The ID of the selected chapter
   * @returns {void} 
   */
  getChapterSteps(id, rank) {
    this.api.get(`chapters/${id}/steps`).then(response => {
      Bus.verbose("api:fetch-steps-chapter-"+id);
      const isLoaded = response.status === 200;
      store.dispatch(fetchSteps(response.data, id));
      if (isLoaded) store.dispatch(setLoadedStep(rank));
    })
  }

  /**
   * Call from ~/App.js when a route is changed
   * @param {string} path 
   */
  loadFromPath(path) {
    // If it's a chapter path
    if (path.indexOf('chapter') > 0) {
      const rank = path.match(/\d+/g).map(Number)[0];
      this.getChapter(rank);
    // }
    } else {
      this.getChapter(1);
    }
  }

  getChapter(rank) {
    const state = store.getState();
    if (!getStepsLoaded(state, rank)) { //If i dont have steps for chapter, then i dont have whole chapter
      const apiRequest = (rank) => { 
          const state = store.getState();
          const chapterId = getChapterApiId(state, rank);
          this.getChapterSteps(chapterId, rank);
        };
  
        if (getIsLoadedChapters(state)) {
          apiRequest(rank);
        } else {
          this.waitingRequests.push({
            request: apiRequest, 
            params: rank
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
      this.waitingRequests = [];
      this.unsubscribe();
    }
  }
}


export default new AppManager();
