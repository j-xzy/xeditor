import { EvtEmitter } from 'evt-emit';
import * as React from 'react';
import { Context } from '../components/provider';
import { EventType } from '../lib/common';
import { shallowEqual } from '../lib/tool';

interface IStateOpt {
  state: Editor.IFeatureState;
  option: Editor.IFeatureOption;
}

export function useFeatureState<R>(mappedState: (state: IStateOpt) => R) {
  const context = React.useContext(Context);
  const savedMappedState = React.useRef(mappedState);
  const [stateOpt, setState] = React.useState(
    context.FeatureStore.SelectedFeature
      ? savedMappedState.current({ state: context.FeatureStore.SelectedFeature.State, option: context.FeatureStore.SelectedFeature.Option })
      : null
  );
  const lastStateOpt = React.useRef(stateOpt);

  const updateState = React.useCallback(() => {
    if (context.FeatureStore.SelectedFeature) {
      const { State, Option } = context.FeatureStore.SelectedFeature;
      const spt = { state: State, option: Option };

      const nextStateOpt = savedMappedState.current(spt);
      if (!shallowEqual(lastStateOpt.current, nextStateOpt)) {
        setState(nextStateOpt);
      }
      lastStateOpt.current = nextStateOpt;
    } else {
      lastStateOpt.current = null;
      setState(null);
    }
  }, []);

  React.useEffect(() => {
    savedMappedState.current = mappedState;

    // mappedState改变了得重新计算一次state
    updateState();
  }, [mappedState]);

  React.useEffect(() => {
    // 响应切换store事件
    function onSwitchStore(currStore: Editor.IStore<any>, lastStore: Editor.IStore<any>) {
      // 解绑上一个store
      lastStore && lastStore.unSubscribe(updateState);

      // 绑定下一个store
      if (currStore) {
        // 避免重复绑定
        currStore.unSubscribe(updateState);
        currStore.subscribe(updateState);
      }

      // 更新state
      if (currStore && context.FeatureStore.SelectedFeature) {
        // 切换store不需要浅比较,直接更新state
        const state = { option: context.FeatureStore.SelectedFeature.Option, state: currStore.getState() };
        setState(savedMappedState.current(state));
      } else {
        setState(null);
      }
    }

    // 绑定切换store事件
    EvtEmitter.Instance.subscribe(EventType.SwitchStore, onSwitchStore);
    return () => {
      // 解绑切换store事件
      EvtEmitter.Instance.unSubscribe(EventType.SwitchStore, onSwitchStore);
    };
  });

  React.useEffect(() => {
    context.FeatureStore.SelectedFeature && context.FeatureStore.SelectedFeature.Store.subscribe(updateState);
    return () => { context.FeatureStore.SelectedFeature && context.FeatureStore.SelectedFeature.Store.unSubscribe(updateState); };
  });

  return stateOpt;
}
