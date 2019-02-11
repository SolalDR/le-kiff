import { createSelector } from 'reselect';

export const getIsLoadedChapters = (state) => state.entities.chaptersLoaded;
export const getChapter = (state, rank) => state.entities && state.entities.chapters.length ? state.entities.chapters.find((chapter) => rank === chapter.rank) : null;
export const getChapterApiId = (state, rank) => getChapter(state, rank) ? getChapter(state, rank).api_id : null;
export const getCurrentScale = ( state) => state.ui.scale;
export const getCurrentInfos = (state) => state.ui.step.infos;
export const getSteps = (state) => state.ui.steps;
export const getStep = (state) => state.ui.step;
export const getChapters = (state) => state.entities.chapters;
export const getIsChapterReady = (state, rank) => state.entities.chaptersReady.indexOf(`chapter-${rank}`) >= 0;
export const getIsAssetLoaded = (state, type) => state.entities.assetsLoaded.indexOf(type) >= 0;
export const getIsTutorialDone = (state) => state.ui.tutorialDone;

export const getStepsForChapter = (state, rank) => {
  const chapter = getChapter(state, rank);
  if (chapter) {
    return state.entities.steps.filter(step => step.chapter_rank === rank)
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


