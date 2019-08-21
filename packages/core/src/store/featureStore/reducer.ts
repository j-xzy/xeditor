export const defaultState: Editor.IFeatureStoreState = {
  name: '画布',
  selectedFeature: null,
  hoverFeature: null,
  insertedAimsFeature: { method: 'child', feature: null },
  dragEnterFeature: null,
  isMoving: false
};

// tslint:disable-next-line:interface-over-type-literal
type IFeatureStoreAction = {
  type: Editor.IFeatureStoreActionType;
  data: any;
};

export const reducer = createReducer({});

export function createReducer(state: Partial<Editor.IFeatureState>) {
  const initialState = { ...defaultState, ...state };
  // tslint:disable-next-line:no-shadowed-variable
  return function reducer(action: IFeatureStoreAction, currState: Readonly<Editor.IFeatureStoreState> = initialState): Readonly<Editor.IFeatureStoreState> {
    switch (action.type) {
      case 'name':
      case 'selectedFeature':
      case 'hoverFeature':
      case 'insertedAimsFeature':
      case 'dragEnterFeature':
      case 'isMoving': {
        return { ...currState, [action.type]: action.data };
      }
    }
    return currState;
  };
}
