import * as React from 'react';

export function FeatureRoot(props: Editor.IWrappedFeatureComponentProps) {
  return props.connect!(<div id='coreditor-root' style={props.style}>{props.children}</div>);
}

const defaultState: Editor.IFeatureState = {
  name: '画布',
  id: 1,
  style: {
    margin: '0',
    padding: '0',
    width: '100%',
    height: '100%',
    float: 'none',
    display: 'block',
    position: 'relative',
    top: '0',
    left: '0',
    overflow: 'hidden',
    zIndex: 0,
    visibility: 'visible'
  }
};

export function reducer(_action: Editor.IAction, currState: Editor.IFeatureState = defaultState) {
  return { ...currState, name: '画布' };
}

export const option: Editor.IFeatureOption = {
  container: true,
  resizer: false,
  toolbar: false
};
