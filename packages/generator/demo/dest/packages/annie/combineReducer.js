export function combineReducer(reducers) {
  return reducers.reduce((pre, curr) =>
    (action, state, allState) => curr(action, pre(action, state, allState), allState)
  );
}
