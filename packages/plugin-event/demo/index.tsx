import { applyPlugins } from '@xeditor/core';
import { ChoosePlugin } from '@xeditor/plugin-choose';
// import { LayerPlugin } from '@xeditor/plugin-layer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EventPlugin } from '../src';
import { App } from './app';
// import { VarPlugin } from './varPlugin';

applyPlugins([EventPlugin, ChoosePlugin]);

const render = (Component: React.ComponentClass | React.StatelessComponent, element: HTMLElement) => {
  ReactDOM.render(
    <Component />,
    element
  );
};

const root = document.getElementById('root');
if (root) {
  render(App, root);
}
