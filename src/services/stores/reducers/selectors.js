import { createSelector } from 'reselect';

export const getIsLoadedChapters = (state) => state.entities.chaptersLoaded;
export const getChapter = (state, rank) => state.entities.chapters.find((chapter) => rank === chapter.rank);
export const getChapterApiId = (state, rank) => getChapter(state, rank) ? getChapter(state, rank).api_id : null;
export const getCurrentScale = ( state) => state.ui.scale;
export const getCurrentInfos = (state) => state.ui.step.infos;
export const getSteps = (state) => state.ui.steps;
export const getStep = (state) => state.ui.step;


export const getStepsForChapter = (state, rank) => {
  const chapterApiId = getChapterApiId(state, rank);
  if (chapterApiId) {
    return state.entities.steps.filter(step => step.chapter_id === chapterApiId)
  }
  return [];
}

export const getWholeChapter = createSelector(
  [getChapter, getStepsForChapter], (chapter, steps) => {
    return { 
      ...chapter, steps: steps 
    }
  }
);

export const getStepsLoaded = createSelector(
  [getStepsForChapter], (steps) => {
    return steps.length > 0;
  }
)


