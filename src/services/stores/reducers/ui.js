import {
  SET_CURRENT_CHAPTER_DATA,
  SET_CURRENT_INFOS,
  SET_CURRENT_STEP,
  SET_CURRENT_SCALE,
  SET_CURRENT_STEP_RANK,
  SET_TUTORIAL_DONE
} from '../actionTypes';

const initialState = {
  //Current chapter
  chapter: {},

  //For timeline nav
  steps: [],

  //Current step
  step: {},

  //Current infos
  infos: [],
  scale: 'human',
  tutorialDone: false
};

const ui = (state = initialState, action) => {
  switch (action.type) {

    case SET_CURRENT_CHAPTER_DATA:
      return {
        ...state,
        chapter: action.chapterData.chapter,
        infos: action.chapterData.infos,
        scale: action.chapterData.scale,
        step: action.chapterData.step,
        steps: action.chapterData.steps
      }

    case SET_CURRENT_STEP:
      return {
        ...state,
        step: action.step
      }

    case SET_CURRENT_INFOS:
      return {
        ...state,
        infos: action.infos
      }

    case SET_CURRENT_SCALE:
      return {
        ...state,
        scale: action.scale
      }

    case SET_CURRENT_STEP_RANK:
      const currentStepRank = action.rank;
      const step = getItem(state.steps, currentStepRank);

      if (step && step.rank) {
        return {
          ...state,
          step: step
        }
      } else {
        return state;
      } 
      
    case SET_TUTORIAL_DONE:
      return {
        ...state,
        tutorialDone: true
      }

    default:
      return state;
  }
}

const getItem = (list, rank) => {
  let obj = {};
  list.forEach(item => {
    if (item.rank === rank) {
      obj = item;
    }
  })

  return obj;
}


export default ui;
