import { Expression } from '@xeditor/expression';
import * as React from 'react';
import { useFeatureDispatch, useFeatureState } from '../../src';
import { useDataDriver } from '../../src';

import './style.css';

export function StyleWidget() {
  const [state, dispatch] = [useFeatureState((s) => s.state), useFeatureDispatch()];
  const d = useDataDriver();

  if (!state || !dispatch) {
    return null;
  }

  const styles: Array<{ name: string, value: any }> = [];
  if (state.style) {
    for (const k in state.style) {
      styles.push({ name: k, value: (state.style as any)[k] });
    }
  }
  const propertys: Array<{ name: string, value: any }> = [];
  if (state.property) {
    for (const k in state.property) {
      propertys.push({ name: k, value: (state.property as any)[k] });
    }
  }

  return (
    <div className='style-widget'>
      <div>
        <h3>style</h3>
        {
          styles.map(({ name, value }) => renderItem('style', name, value))
        }
      </div>
      <div>
        <h3>property</h3>
        {
          propertys.map(({ name, value }) => renderItem('property', name, value))
        }
      </div>
      <div>
        <h3>data</h3>
        {
          typeof state.data !== 'undefined' && renderItem('', 'data', state.data)
        }
      </div>
    </div>
  );

  function renderItem(prefix: string, name: string, value: any) {
    let fullName = `${prefix}.${name}`;
    if (prefix === '') {
      fullName = name;
    }
    const binded = d.getBinded(state!.id!, `${fullName}`);
    return (
      <div key={name}>
        {name}:
        {
          binded
            ? <Expression flag={`binded-${state!.id}-${fullName}`} getFeatureById={d.getFeatureById} nodes={binded.getChildren() as any} />
            : <input type='text' value={value} onChange={(e) => dispatch!({ type: prefix === '' ? name : `${prefix}-${name}`, data: e.target.value })} />
        }
        <button onClick={() => binded ? d.dispatch('delete', { id: state!.id, property: `${fullName}` }) : d.dispatch('new', { id: state!.id, property: `${fullName}` })}>@</button>
      </div>
    );
  }
}
