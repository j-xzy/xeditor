import { applyPlugins, Provider } from '@xeditor/core';
import { EventPlugin } from '@xeditor/plugin-event';
import { LayerPlugin } from '@xeditor/plugin-layer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';

applyPlugins([LayerPlugin, EventPlugin]);

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
