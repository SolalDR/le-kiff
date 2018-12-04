export const getWholeChapter = (state, id) => {
  let chapter = {};
  if (state.entities.chapters && state.entities.chapters.length) {

    state.entities.chapters.forEach( (item, index) => {
      if (item.id == id) {
        chapter = item;
      }
    });
    
    const steps = state.entities.steps.filter((item) => {
      if (item.chapter_id == chapter.api_id) {
        return item;
      }
    });

    return {
      ...chapter,
      steps: steps
    };
  }
}

export const getChapter = (state, id) => {
  if (state.entities.chapters && state.entities.chapters.length) {
    state.entities.chapters.forEach( (item, index) => {
      if (item.id == id) {
        return item;
      }
    });
  }
}

