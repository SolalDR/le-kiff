import { FETCH_CHAPTERS, FETCH_STEPS, SET_LOADED_STEP } from '../actionTypes';

const initialState = {
  chaptersLoaded: false,
  stepsLoadedChapterIds: [],
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

    case FETCH_STEPS:
      const newSteps = filterArrays(state.steps, action.steps);
      return  {
        ...state,
        steps: [
          ...state.steps,
          ...newSteps.map((item, index) => {
            return {
              ...item,
              chapter_id: action.chapter_id
            }
          })
        ]
      } 

    case SET_LOADED_STEP:
      const newChapterIds = getNewLoadedSteps(state.stepsLoadedChapterIds, action.chapter_id);
      return {
        ...state,
        stepsLoadedChapterIds: [
          ...state.stepsLoadedChapterIds,
          ...[ newChapterIds ]
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

const getNewLoadedSteps = (chapterIds, id) => {
  if (chapterIds.indexOf(id) < 0) {
    return id;
  }

  return [];
}
