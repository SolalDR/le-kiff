import { createSelector } from 'reselect';

export const getIsLoadedChapters = (state) => state.entities.chaptersLoaded;
export const getChapter = (state, id) => state.entities.chapters.find((chapter) => id === chapter.id);
export const getStepsForChapter = (state, id) => state.entities.steps.filter((step) => id === step.id);

export const getWholeChapter = createSelector(
  [getChapter, getStepsForChapter], (chapter, steps) => {
    return { 
      ...chapter, steps: steps 
    }
  }
);

export const getStepsLoaded = createSelector(
  [getStepsForChapter], (steps) => steps.length > 0
)
