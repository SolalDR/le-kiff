import { FETCH_CHAPTERS, FETCH_STEPS, SET_CURRENT_CHAPTER, SET_CURRENT_CHAPTER_DATA, SET_CURRENT_INFOS, SET_CURRENT_STEP, SET_STEPS, SET_SCALE } from './actionTypes';  

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

export const setCurrentChapter = (chapter) => {
  return {
    type: SET_CURRENT_CHAPTER,
    chapter
  }
};

export const setCurrentChapterData = (chapterData) => {
  return {
    type: SET_CURRENT_CHAPTER,
    chapterData
  }
};

export const setCurrentInfos = (infos) => {
  return {
    type: SET_CURRENT_INFOS,
    infos
  }
};

export const setCurrentStep = (step) => {
  return {
    type: SET_CURRENT_STEP,
    step
  }
};

export const setSteps = (steps) => {
  return {
    type: SET_STEPS,
    steps
  }
}

export const setScale = (scale) => {
  return {
    type: SET_SCALE,
    scale
  }
}



