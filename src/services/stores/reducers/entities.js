import { FETCH_CHAPTERS, FETCH_INFOS, FETCH_STEPS } from '../actionTypes';

const initialState = {
  chapters: [],
  infos: [],
  steps: []
};

const entities = (state = initialState, action) => {
  switch (action.type) {
      
    case FETCH_CHAPTERS:
      return  {
        ...state,
        chapters: [
          ...state.chapters,
          ...action.chapters.map((chapter, index) => {
            return {
              ...chapter,
              api_id: chapter.id,
              id: index++
            }
          })
        ]
      } 

    case FETCH_INFOS:
      return  {
        ...state,
        infos: [
          ...state.infos,
          ...action.infos.map((info, index) => {
            return {
              ...info,
              api_id: info.id,
              id: index++
            }
          })
        ]
      } 

    case FETCH_STEPS:
      return  {
        ...state,
        steps: [
          ...state.steps,
          ...action.steps.map((step, index) => {
            return {
              ...step,
              api_id: step.id,
              id: index++
            }
          })
        ]
      } 


    default:
      return state;
  }
}

export default entities;
