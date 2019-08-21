import * as React from 'react';
import { controlConnector, usePlugin } from '../../src';

interface IProps extends React.Props<any> {
  display?: Editor.IDisplay;
  onDisplayChange?: (display: string) => void;
}

function mapStateToProps(state: any, ownProps: IProps) {
  if (!state.style) {
    return null;
  }

  const { display } = state.style;
  return { display };
}

const mapDispatchToProps = {
  onDisplayChange: (display: string) => ({
    type: 'display',
    data: display
  })
};

function RawDisplayControl(props: IProps) {
  // 测试usePlugin
  // const result = usePlugin('ShortCut');
  // tslint:disable-next-line:no-console
  // console.log('usePluginHook', result);
  if (!props.display) {
    return null;
  }

  return (
    <div>
      <h3>Display</h3>
      <select value={props.display} onChange={(e) => props.onDisplayChange!(e.target.value)}>
        <option value='block' >block</option>
        <option value='inline-block' >inline-block</option>
        <option value='inline' >inline</option>
      </select>
    </div>
  );
}

export const DisplayControl = controlConnector(mapStateToProps, mapDispatchToProps)(RawDisplayControl);
