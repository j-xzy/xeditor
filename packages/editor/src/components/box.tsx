import { featureConnector } from '@xeditor/core';
import * as React from 'react';
import { advanceOption } from '../util/advanceOption';
import { advanceReducer } from '../util/advanceReducer';

interface IProps extends React.Props<any> {
  //
}

const boxState: Editor.IFeatureState = {
  name: '容器',
  style: {
    outline: '1px dashed rgba(170,170,170,1)',
    width: '300px',
    height: '300px',
    backgroundImage: 'url()',
    backgroundSize: 'cover',
    backgroundColor: 'rgba(255,255,255,0)'
  }
};

export const boxOption: Editor.IFeatureOption = {
  container: true,
  box: true,
  event: {
    trigger: [
      {
        name: '点击',
        type: 'click'
      }, {
        name: '鼠标进入',
        type: 'onMouseEnter'
      }, {
        name: '鼠标移出',
        type: 'onMouseOut'
      }, {
        name: '鼠标Over',
        type: 'onMouseOver'
      }, {
        name: '鼠标Move',
        type: 'onMouseMove'
      }
    ]
  }
};

export function rawBoxReducer(_action: Editor.IAction, state = boxState) {
  return state;
}

export const boxReducer = advanceReducer(rawBoxReducer);

export function RawBox({ style, children, connect }: Editor.IWrappedFeatureComponentProps) {
  return connect(
    <div
      style={{ ...style }}>
      {children}
    </div>
  );
}

export function Box(props: IProps) {
  const PreivewComponent = function(prevProps: Editor.IPreivewComponentProps) {
    return prevProps.connect(React.Children.only(props.children));
  };
  const preview = { PreivewComponent, dragImg: new Image() };

  return React.createElement(featureConnector(advanceOption(boxOption), preview, boxReducer)(RawBox), { ...props, trigger: () => {/** */ } } as any);
}
