import { applyPlugins, Provider } from '@xeditor/core';
import { ChoosePlugin } from '@xeditor/plugin-choose';
import { LayerPlugin } from '@xeditor/plugin-layer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DataDriverPlugin } from '../src';
import { App } from './app';
import { VarPlugin } from './varPlugin';

applyPlugins([ChoosePlugin, VarPlugin, LayerPlugin, DataDriverPlugin]);

const render = (Component: React.ComponentClass | React.StatelessComponent, element: HTMLElement) => {
  ReactDOM.render(
    <Provider>
      <Component />
    </Provider>,
    element
  );
};

const root = document.getElementById('root');
if (root) {
  render(App, root);
}
