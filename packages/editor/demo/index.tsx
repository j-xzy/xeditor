import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { setConfig } from '../src';
import { App } from './app';

setConfig({
  requirejs: {
    paths: {
      react: '/public/lib/react'
    }
  },
  fontPath: 'http://192.168.5.11:8085/hyeditor/fonts'
});

const render = (Component: React.ComponentClass, element: HTMLElement) => {
  ReactDOM.render(
    <Component />,
    element
  );
};

const root = document.getElementById('root');
if (root) {
  render(App, root);
}
