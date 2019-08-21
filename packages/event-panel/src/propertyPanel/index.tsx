import { Expression } from '@xeditor/expression';
import { IEventPluginState, PropertyExpression, WithTreeNode } from '@xeditor/plugin-event';
import { Select } from 'lite-ui/lib/select';
import * as React from 'react';
import { useSubscribes } from '../hooks/useSubscribes';
import { IOpts } from '../index';
import './style.styl';

interface IProps {
  style: React.CSSProperties;
  node: WithTreeNode<PropertyExpression>;
  evt: IEventPluginState;
  newPropertyExp: () => void;
  opts: { [p: string]: string };
  selectOpts: IOpts;
}

export function PropertyPanel(props: IProps) {
  const propertyExps = props.node.getChildren();
  const Options: JSX.Element[] = [];

  for (const k in props.opts) {
    Options.push(
      <Select.Option value={k} key={k}>{props.opts[k]}</Select.Option>
    );
  }

  useSubscribes(propertyExps);

  return (
    <div className='evt-property-panel' style={{ ...props.style }}>
      {
        propertyExps.map((propertyExp) => (
          <div className='evt-property-panel-item' key={propertyExp.id}>
            {
              propertyExp.property === '' ?
                <Select className='evt-property-panel-select' value={propertyExp.property} onChange={(value) => propertyExp.dispatch('property', value)}>
                  <Select.Option value='' key={''}>请选择</Select.Option>
                  {Options}
                </Select>
                :
                <span className='evt-property-panel-label'>
                  {props.opts[propertyExp.property]}
                </span>
            }
            {propertyExp.property !== '' && <Expression selectOpts={props.selectOpts.propertySelectOpts} flag={`prop${propertyExp.id}`} getFeatureById={props.evt.getFeatureById} nodes={propertyExp.data.getChildren()} />}
            <i className='icon-fx evt-property-panel-delete' onClick={() => propertyExp.dispatch('remove')} />
          </div>
        ))
      }
      <i className='icon-yj evt-property-panel-add' onClick={props.newPropertyExp} />
    </div>
  );
}
