import { applyPlugins, Provider } from '@xeditor/core';
import { EventPlugin } from '@xeditor/plugin-event';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LayerPlugin } from '../src';
import { App } from './app';

applyPlugins([LayerPlugin]);

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
