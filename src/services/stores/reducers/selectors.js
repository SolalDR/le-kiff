import { createSelector } from 'reselect';

export const getIsLoadedChapters = (state) => state.entities.chaptersLoaded;
export const getChapter = (state, id) => state.entities.chapters.find((chapter) => id === chapter.id);
export const getStepsForChapter = (state, id) => state.entities.steps.filter((step) => id === step.id);
export const getChapterApiId = (state, id) => getChapter(state, id) ? getChapter(state, id).api_id : null;
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
