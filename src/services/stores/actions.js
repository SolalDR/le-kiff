import { FETCH_CHAPTERS, FETCH_INFOS, FETCH_STEPS } from './actionTypes';  

export const fetchChapters = (chapters) => {
  return {
    type: FETCH_CHAPTERS,
    chapters
  }
};

export const fetchInfos = (infos) => {
  return {
    type: FETCH_INFOS,
    infos
  }
};

export const fetchSteps = (steps) => {
  return {
    type: FETCH_STEPS,
    steps
  }
};


