import { createStore, combineReducers } from 'redux';
import entities from './reducers/entities.js';
import ui from './reducers/ui.js';

const stores = combineReducers({
  entities,
  ui
});

export const store = createStore(
  stores
);

