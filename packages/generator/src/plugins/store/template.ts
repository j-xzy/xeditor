export const bodyTemplate = `import { createStore, combineReducer } from '../../packages/annie';
import compReducer from './compReducer';
import varReducer from './varReducer';
import apiReducer from './apiReducer';
IMPORTS

const store = createStore();

BODYS

export default store;
`;

export const serverTemplate = `async (action, state, allState) => {
  const property = PROPERTY;
  const result = await apiReducer({ type: action.type, data: property }, state, allState);
  return result;
}`;
