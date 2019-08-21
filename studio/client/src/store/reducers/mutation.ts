import update from 'immutability-helper';
import { IGetState, IState } from '../createStore';

export function progress(getState: IGetState, on: boolean) {
  return update(getState(), {
    progress: {
      $set: on
    }
  });
}

export function widgetPs(getState: IGetState, ps: [number, number]) {
  window.sessionStorage.setItem('widgetPs', JSON.stringify(ps));
  return update(getState(), {
    widgetPs: {
      $set: ps
    }
  });
}

export function projectName(getState: IGetState, name: string) {
  return update(getState(), {
    projectName: {
      $set: name
    }
  });
}

export function widget(getState: IGetState, type: IState['widget']) {
  let widgetType = type;
  if (type === getState().widget) {
    widgetType = 'none';
  }
  return update(getState(), {
    widget: {
      $set: widgetType
    }
  });
}

export function selectedFtr(getState: IGetState, info: Editor.IFeatureInfo | null) {
  return update(getState(), {
    selectedFtr: {
      $set: info
    }
  });
}

export function componentList(getState: IGetState, list: IState['componentList']) {
  return update(getState(), {
    componentList: {
      $set: list
    }
  });
}

export function openCanvasLoadingId(getState: IGetState, id: number) {
  return update(getState(), {
    openCanvasLoadingId: {
      $set: id
    }
  });
}

export function saveCanvasLoadingId(getState: IGetState, id: number) {
  return update(getState(), {
    saveCanvasLoadingId: {
      $set: id
    }
  });
}

export function mask(getState: IGetState, flag: string | null) {
  return update(getState(), {
    mask: {
      $set: flag
    }
  });
}
