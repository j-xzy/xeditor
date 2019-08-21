import { useFeatureDispatch, useFeatureState } from '@xeditor/core';
import { Expression as ExpNode, useDataDriver } from '@xeditor/plugin-data-driver';
import * as React from 'react';
import { Expression } from '../../src';
import './style.styl';

export function StyleWidget() {
  const state = useFeatureState((s) => s.state);
  const dispatch = useFeatureDispatch();
  const d = useDataDriver();
  if (!state || !state.style || !dispatch) {
    return null;
  }

  const bindedNode = d.getAllBindedById(state.id!);

  return (
    <div>
      <div>
        <span>width</span>
        {
          bindedNode && bindedNode['style.width'] ?
            <>
              <Expression
                selectOpts={[{ name: '默认参数', value: 'data' }, { name: 'X', value: 'x' }]}
                flag={`binded-${state.id}-style.width}`}
                getFeatureById={d.getFeatureById}
                nodes={bindedNode['style.width'].getChildren() as ExpNode[]}
              />
              <button onClick={() => d.dispatch('delete', { id: state.id, property: 'style.width' })}>@</button>
            </>
            :
            <>
              <input type='text' value={state.style.width} onChange={(e) => dispatch({ type: 'width', data: e.target.value })} />
              <button onClick={() => d.dispatch('new', { id: state.id, property: 'style.width' })}>@</button>
            </>
        }
      </div>
      <div>
        <span>height</span>
        {
          bindedNode && bindedNode['style.height'] ?
            <>
              <Expression flag={`binded-${state.id}-style.height}`} getFeatureById={d.getFeatureById} nodes={bindedNode['style.height'].getChildren() as ExpNode[]} />
              <button onClick={() => d.dispatch('delete', { id: state.id, property: 'style.height' })}>@</button>
            </>
            :
            <>
              <input type='text' value={state.style.height} onChange={(e) => dispatch({ type: 'height', data: e.target.value })} />
              <button onClick={() => d.dispatch('new', { id: state.id, property: 'style.height' })}>@</button>
            </>
        }
      </div>
    </div>
  );
}
