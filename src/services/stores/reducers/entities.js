import { ADD_CHAPTERS, ADD_INFOS, ADD_STEPS } from '../actionTypes';

const initialState = {
  chapters: [],
  infos: [],
  steps: []
};

const entities = (state = initialState, action) => {
  switch (action.type) {
      
    case ADD_CHAPTERS:
      return {
        ...state,
        chapters: action.chapters
      }

    case ADD_INFOS:
      return {
        ...state,
        infos: action.infos
      }

    case ADD_STEPS:
      return {
        ...state,
        steps: action.steps
      }


    default:
      return state;
  }
}

export default entities;
