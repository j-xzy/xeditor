export default function compReducer(action, state, allState) {
  switch (action.type) {
    case 'setStyle': {
      return { ...state, style: { ...state.style, ...action.data } }
    }
    case 'setProperty': {
      return { ...state, property: { ...state.property, ...action.data } }
    }
    case 'setData': {
      return { ...state, data: action.data };
    }
    case 'show': {
      return { ...state, style: { ...state.style, display: 'block' } }
    }
    case 'hide': {
      return { ...state, style: { ...state.style, display: 'none' } }
    }
    case 'toggle': {
      return { ...state, style: { ...state.style, display: state.style.display === 'none' ? 'block' : 'none' } }
    }
    default: {
      return state;
    }
  }
}