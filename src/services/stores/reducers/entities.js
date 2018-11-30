import { FETCH_CHAPTERS, FETCH_INFOS, FETCH_STEPS } from '../actionTypes';

const initialState = {
  chapters: [],
  infos: [],
  steps: []
};

const entities = (state = initialState, action) => {
  switch (action.type) {
      
    case FETCH_CHAPTERS:
      return {
        ...state,
        chapters: action.chapters
      }

    case FETCH_INFOS:
      return {
        ...state,
        infos: action.infos
      }

    case FETCH_STEPS:
      return {
        ...state,
        steps: action.steps
      }


    default:
      return state;
  }
}

export default entities;
