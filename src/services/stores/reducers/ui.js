import { SET_CURRENT_CHAPTER_DATA, SET_CURRENT_INFOS, SET_CURRENT_STEP, SET_SCALE } from '../actionTypes';

const initialState = {
  //Current chapter
  chapter: {},

  //For timeline nav
  steps: [],

  //Current step
  step: {},

  //Current infos
  infos: [],
  scale: {}
};

const ui = (state = initialState, action) => {
  switch (action.type) {

    case SET_CURRENT_CHAPTER_DATA:
      return {
        ...state,
        chapter: action.chapterData.chapter,
        infos: action.chapterData.infos,
        scale: action.chapterData.scale,
        step: action.chapterData.step
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

    case SET_SCALE:
      return {
        ...state,
        scale: action.scale
      }

    default:
      return state;
  }
}

export default ui;
