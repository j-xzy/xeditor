export function reducer(action: Editor.IAction, currState: Editor.IFeatureState): Readonly<Editor.IFeatureState> {
  const newState = { ...currState };
  switch (action.type) {
    case 'style':
      newState.style = action.data;
      return newState;
    case 'name':
      newState.name = action.data;
      return newState;
    case 'backgroundImage':
    case 'backgroundColor':
    case 'background':
    case 'height':
    case 'width':
    case 'float':
    case 'display':
    case 'margin':
    case 'padding':
    case 'position':
    case 'visibility':
    case 'left':
    case 'top':
    case 'right':
    case 'bottom':
    case 'flexDirection':
    case 'flexWrap':
    case 'flexFlow':
    case 'justifyContent':
    case 'alignItems':
    case 'alignContent':
    case 'order':
    case 'flexGrow':
    case 'flexShrink':
    case 'flexBasis':
    case 'flex':
    case 'alignSelf':
      newState.style = { ...newState.style, [action.type]: action.data };
      return newState;
    default:
      return currState;
  }
}
