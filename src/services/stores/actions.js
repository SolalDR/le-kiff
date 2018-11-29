import { ADD_CHAPTERS, ADD_INFOS, ADD_STEPS } from './actionTypes';  

export const addChapters = (chapters) => {
  return {
    type: ADD_CHAPTERS,
    chapters
  }
};

export const addInfos = (infos) => {
  return {
    type: ADD_INFOS,
    infos
  }
};

export const addSteps = (steps) => {
  return {
    type: ADD_STEPS,
    steps
  }
};


