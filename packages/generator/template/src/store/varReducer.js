export default function varReducer(action, state, allState) {
  switch (action.type) {
    case 'setData': {
      return { ...state, data: action.data };
    }
    default: {
      return state;
    }
  }
}