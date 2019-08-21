import { applyPlugins, Provider } from '@xeditor/core';
import { ChoosePlugin } from '@xeditor/plugin-choose';
import { DataDriverPlugin } from '@xeditor/plugin-data-driver';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import { VarPlugin } from './varPlugin';

applyPlugins([ChoosePlugin, VarPlugin, DataDriverPlugin]);

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
