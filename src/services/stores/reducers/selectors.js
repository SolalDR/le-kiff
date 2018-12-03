import store from '../store';
import { createSelector } from 'reselect'

export const getChapter = createSelector([state => state.chapters], (chapters) => chapters)
