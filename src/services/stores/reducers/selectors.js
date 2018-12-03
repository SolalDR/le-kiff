export const getChapter = (state, id) => {
  let chapter = {};
  state.entities.chapter.forEach( (item, index) => {
    if (item.id == id) {
      chapter = item;
    }
  });

  const steps = state.entities.filter( (item) => {
    if (item.chapter_id == item.api_id) {
      return item;
    }
  });

  return {
    ...chapter,
    steps: steps
  };
}
