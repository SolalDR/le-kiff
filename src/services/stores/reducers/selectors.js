import { createSelector } from 'reselect';

export const getIsLoadedChapters = (state) => state.entities.chaptersLoaded;
export const getChapter = (state, rank) => state.entities.chapters.find((chapter) => rank === chapter.rank);
export const getStepsForChapter = (state, rank) => state.entities.steps.filter((step) => rank === step.rank);
export const getChapterApiId = (state, rank) => getChapter(state, rank) ? getChapter(state, rank).api_id : null;
export const getCurrentScale = ( state) => state.ui.scale;
export const getCurrentInfos = (state) => state.ui.step.infos;

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
