import { FETCH_CHAPTERS, FETCH_STEPS } from './actionTypes';  

export const fetchChapters = (chapters) => {
  return {
    type: FETCH_CHAPTERS,
    chapters
  }
};


export const fetchSteps = (steps, chapter_id) => {
  return {
    type: FETCH_STEPS,
    steps,
    chapter_id
  }
};


