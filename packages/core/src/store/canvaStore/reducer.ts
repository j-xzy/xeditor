export const defaultState: Editor.ICanvaStoreState = {
  name: 'canvaStore',
  id: 0,
  style: {
    scale: 1
  }
};

export const reducer: Editor.IReducer<Editor.ICanvaStoreState> = (action: Editor.IAction, currState = defaultState as any) => {
  switch (action.type) {
    case 'style': {
      return { ...currState, style: action.data };
    }
    case 'backgroundImage':
    case 'backgroundColor':
    case 'background':
    case 'height':
    case 'width': {
      return { ...currState, style: { ...currState.style, [action.type]: action.data } };
    }
  }
  return currState;
};
