import { ChooseArrow, Expression } from '@xeditor/expression';
import { Action, Expression as ExpNode, IEventPluginState, PropertyExpression, WithTreeNode } from '@xeditor/plugin-event';
import { Select } from 'lite-ui/lib/select';
import * as React from 'react';
import { IWidget, styleDic } from '../dic';
import { equalActionState } from '../equal';
import { useFtrSubscribe } from '../hooks/useFtrSubscribe';
import { useSubscribes } from '../hooks/useSubscribes';
import { IOpts, IPlaceProps } from '../index';
import { Node } from '../node';
import { PropertyPanel } from '../propertyPanel';
import './style.styl';

interface IProps extends React.Props<any> {
  node: Action;
  evt: IEventPluginState;
  isLastChild: boolean;
  setPlaceholder: (p: IPlaceProps) => void;
  getPlaceholder: () => IPlaceProps;
  selectOpts: IOpts;
}

export const ActionNode = React.memo(RawActionNode, (pre, next) => {
  if (pre.isLastChild !== next.isLastChild || pre.node !== next.node) {
    return false;
  }

  return equalActionState(pre.node.State, next.node.State);
});

function RawActionNode(props: IProps) {
  let name = '';
  let response: Required<Editor.PluginEvent.IEventOpt>['response'] = [];

  const ftr = props.evt.getFeatureById(props.node.targetId);
  const [drop, setDrop] = React.useState(true);
  const isPropertyPanel = props.node.actType === 'setProperty' || props.node.actType === 'setStyle';
  const opts: { [p: string]: string } = {};

  if (ftr) {
    name = ftr.State.name;
    if (ftr.Option.event && ftr.Option.event.response) {
      response = ftr.Option.event.response;
    }

    if (props.node.actType === 'setProperty' && ftr.State.property) {
      const dic: any = typeof (ftr.Option as any).property === 'undefined' ? {} : (ftr.Option as any).property as IWidget;
      for (const k in ftr.State.property) {
        const pname = typeof dic[k] === 'undefined' ? k : dic[k].name;
        opts[k] = pname;
      }
    }

    if (props.node.actType === 'setStyle') {
      for (const k in ftr.State.style) {
        const pname = typeof styleDic[k] === 'undefined' ? k : styleDic[k].name;
        opts[k] = pname;
      }
    }
  }

  useSubscribes([props.node]);

  useFtrSubscribe(ftr ? [ftr] : []);

  const hanldeChoose = React.useCallback((state: Editor.IFeatureState | null) => {
    if (state === null) {
      return;
    }
    props.node.dispatch('targetId', state.id!);
  }, [props.node]);

  return (
    <Node className='evt-action' color={[3, 138, 3]} {...props} >
      <>
        <ChooseArrow className='evt-action-arrow' flag={`action${props.node.id}`} onChoose={hanldeChoose} />
        <span className='evt-action-target'>{name === '' ? '目标对象' : name}</span>
      </>
      <>
        <Select className='evt-action-type-select' value={props.node.actType}
          onChange={(value) => props.node.dispatch('actType', value)}
        >
          {props.node.actType === '' && <Select.Option value=''>选择动作</Select.Option>}
          {
            response.map((res) => <Select.Option key={res.type} value={res.type}>{res.name}</Select.Option>)
          }
        </Select>
        {
          isPropertyPanel
            ? <i className={`icon-arr evt-action-drop-btn ${drop ? '' : 'evt-action-drop-btn-up'}`} onClick={() => setDrop(!drop)} ></i>
            : <Expression selectOpts={props.selectOpts.actionSelectOpts} getFeatureById={props.evt.getFeatureById} flag={`action${props.node.id}params`} placeholder='&nbsp;默认参数' nodes={(props.node.data as WithTreeNode<ExpNode>).getChildren()} />
        }
        <i className='icon-fx evt-action-fx' onClick={() => props.node.dispatch('remove')} />
        <i className='icon-fj evt-action-fj' onClick={() => props.evt.newNode('EmptyAction', props.node)} />
      </>
      <>
        {
          isPropertyPanel &&
          <PropertyPanel
            selectOpts={props.selectOpts}
            style={{ display: `${isPropertyPanel && drop ? 'block' : 'none'}` }}
            newPropertyExp={() => props.node.dispatch('newPropertyExp')}
            opts={opts}
            evt={props.evt}
            node={props.node.data as WithTreeNode<PropertyExpression>}
          />
        }
      </>
    </Node>
  );
}
