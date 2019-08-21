import update from 'immutability-helper';

export interface IAdvanceFeatureInfo extends Editor.IFeatureInfo {
  state: Editor.IState | Editor.ICanvaStoreState | {};
}

export type IRawReducer = (action: Editor.IAction, currState?: Editor.IFeatureState) => Editor.IFeatureState;

const defaultStyle: Editor.IFeatureState['style'] = {
  position: 'relative',
  visibility: 'visible',
  display: 'block',
  float: 'none',
  width: '0px',
  height: '0px',
  zIndex: 0,
  margin: '0px',
  padding: '0px',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: '0 1 auto',
  backgroundImage: 'url()',
  backgroundSize: 'cover',
  backgroundColor: 'rgba(255,255,255,0)'
};

const defaultProperty: Editor.IFeatureState['property'] = {
  refresh: -1
};

export function advanceReducer(reducer: IRawReducer) {
  let originState = reducer({ type: '__init', data: null });
  if (originState.style) {
    const mergeStyle = update(defaultStyle, {
      $merge: originState.style
    });
    originState = update(originState, {
      style: { $set: mergeStyle }
    });
  }

  const mergeProperty = update(defaultProperty, {
    $merge: typeof originState.property === 'undefined' ? {} : originState.property
  });

  originState = update(originState, {
    property: { $set: mergeProperty }
  });

  function reducerAdvance(action: Editor.IAction, state = originState) {
    const types: string[] = action.type.split('-');

    switch (types[0]) {
      case 'style':
      case 'data':
      case 'property': {
        const aim = getAim(types, action.data);
        return update(state, aim);
      }
    }

    return reducer(action, state);
  }

  return reducerAdvance as Editor.IReducer<Editor.IFeatureState>;
}

// [property, title, value] => { property: { title: { value: { $set: xxx } } } }
function getAim(types: string[], data: any) {
  if (types.length <= 0) {
    throw (new Error('长度必大于0'));
  }

  let cur: any;
  const aim: any = {
    [types[0]]: {}
  };
  cur = aim[types[0]];

  // tslint:disable-next-line:prefer-for-of
  for (let i = 1; i < types.length; i++) {
    cur[types[i]] = {};
    cur = cur[types[i]];
  }
  cur.$set = data;
  return aim;
}
