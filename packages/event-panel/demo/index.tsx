import { applyPlugins } from '@xeditor/core';
import { ChoosePlugin } from '@xeditor/plugin-choose';
import { EventPlugin } from '@xeditor/plugin-event';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';

applyPlugins([ChoosePlugin, EventPlugin]);

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
