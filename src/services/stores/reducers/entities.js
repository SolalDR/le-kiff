import { FETCH_CHAPTERS, FETCH_INFOS, FETCH_STEPS } from '../actionTypes';

const initialState = {
  chapters: [],
  steps: []
};

const entities = (state = initialState, action) => {
  switch (action.type) {
      
    case FETCH_CHAPTERS:
      return  {
        ...state,
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

const getLastId = (array) => {
  let max = 0;

  array.forEach(item => {
    if (max < item.id) {
      max = item.id;
    }
  });

  return max;
}

const filterArrays = (currentList, newList) => {
  const idsList = getIds(currentList);
  let lastId = getLastId(currentList);
  
  const list = [];
  newList.forEach((item, index) => {
    if ( idsList.indexOf(item.id) == -1) {
      list.push({
        ...item,
        api_id: item.id,
        id: lastId++
      });
    }
  });

  return list
}
