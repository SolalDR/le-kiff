import { FETCH_CHAPTERS, FETCH_STEPS, SET_CURRENT_CHAPTER, SET_CURRENT_CHAPTER_DATA, SET_CURRENT_INFOS, SET_CURRENT_STEP, SET_STEPS, SET_CURRENT_SCALE, SET_LOADED_STEP, SET_CURRENT_STEP_RANK, SET_LOADED_ASSETS } from './actionTypes';  

export const fetchChapters = (chapters, payload) => {
  return {
    type: FETCH_CHAPTERS,
    chapters,
    payload
  }
};

export const fetchSteps = (steps, chapter_api_id) => {
  return {
    type: FETCH_STEPS,
    steps,
    chapter_api_id
  }
};

export const setLoadedStep = (chapter_rank) => {
  return {
    type: SET_LOADED_STEP,
    chapter_rank
  }
}

export const setCurrentChapter = (chapter) => {
  return {
    type: SET_CURRENT_CHAPTER,
    chapter
  }
};

export const setCurrentChapterData = (chapterData) => {
  return {
    type: SET_CURRENT_CHAPTER_DATA,
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

export const setCurrentStepRank = (rank) => {
  return {
    type: SET_CURRENT_STEP_RANK,
    rank
  }
};

export const setSteps = (steps) => {
  return {
    type: SET_STEPS,
    steps
  }
}

export const setCurrentScale = (scale) => {
  return {
    type: SET_CURRENT_SCALE,
    scale
  }
}

export const setLoadedAssets = (chapter_rank) => {
  return {
    type: SET_LOADED_ASSETS,
    chapter_rank
  }
}


