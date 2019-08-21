import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';

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
