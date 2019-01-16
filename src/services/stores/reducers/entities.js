import { FETCH_CHAPTERS, FETCH_STEPS, SET_LOADED_STEP, SET_LOADED_ASSETS } from '../actionTypes';

const initialState = {
  chaptersLoaded: false,
  assetsLoaded: [], //Array of ranks (chapter)
  stepsLoaded: [], //Array of ranks (chapter)
  chaptersReady: [], //Array of ranks (chapter)
  chapters: [],
  steps: []
};

const entities = (state = initialState, action) => {
  switch (action.type) {
      
    case FETCH_CHAPTERS:
      return  {
        ...state,
        chaptersLoaded: action.payload,
        chapters: [
          ...state.chapters,
          ...filterArrays(state.chapters, action.chapters)
        ]
      }

    case SET_LOADED_ASSETS:
      let isChapterReady = getIsChapterReady(state, action.chapter_rank);
      return {
        ...state,
        chaptersReady: isChapterReady ? 
        [...state.chaptersReady,
          ...[action.chapter_rank]
        ] : state.chaptersReady,
        assetsLoaded: [
          ...state.assetsLoaded,
          ...[ action.chapter_rank ]
        ]
      }

    case FETCH_STEPS:
      const newSteps = filterArrays(state.steps, action.steps);
      const chapter = getChapterByApiId(state.chapters, action.chapter_api_id);
      return  {
        ...state,
        steps: [
          ...state.steps,
          ...newSteps.map((item, index) => {
            return {
              ...item,
              chapter_api_id: action.chapter_api_id,
              chapter_rank: chapter.rank,
              chapter_id: chapter.id
            }
          })
        ]
      } 

    case SET_LOADED_STEP:
      const newChapterRanks = getNewLoadedSteps(state.stepsLoaded, action.chapter_rank);
      isChapterReady = getIsChapterReady(state, action.chapter_api_id);
      return {
        ...state,
        chaptersReady: isChapterReady ? [...state.chaptersReady,
          ...[action.chapter_rank]
        ] : state.chaptersReady,
        stepsLoaded: [
          ...state.stepsLoaded,
          ...[ newChapterRanks ]
        ]
      }

    default:
      return state;
  }
}

export default entities;

const getIds = (array) => {
  return array.map(item => {
    return item.api_id
  });
}

const getNewId = (array) => {
  let max = 0;

  array.forEach(item => {
    if (max < item.id) {
      max = item.id;
    }
  });

  if (max > 0) 
    return max++

  return max;
}

const filterArrays = (currentList, newList) => {
  const idsList = getIds(currentList);
  let newId = getNewId(currentList);
  
  const list = [];
  newList.forEach((item, index) => {
    const rank = index + 1;
    if ( idsList.indexOf(item.id) < 0) {
      list.push({
        ...item,
        api_id: item.id,
        id: newId,
        rank: rank
      });
      newId++
    }
  });
  return list;
}

const getNewLoadedSteps = (chapterRanks, rank) => {
  if (chapterRanks.indexOf(rank) < 0) {
    return rank;
  }

  return [];
}


const getChapterByApiId = (chapterList, api_id) => chapterList.find((chapter) => api_id === chapter.api_id);

// const getById = (itemList, id) => itemList.find((item) => id === item.id);

const getIsChapterReady = (state, chapter_api_id, chapter_rank) => {
  if (!state.chaptersLoaded) {
    return false
  }

  if (state.chaptersReady.length > 0 && state.chaptersReady.indexOf(chapter_rank) >= 0) {
    return false
  }

  if (!state.stepsLoaded.length > 0|| !state.stepsLoaded.indexOf(chapter_rank) < 0) {
    return false
  }

  if (!state.assetsLoaded.length > 0 || !state.assetsLoaded.indexOf(`chapter-${chapter_rank}`) < 0) {
    return false
  }

  return true;
}
