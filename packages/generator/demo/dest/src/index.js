import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '../packages/annie';
import store from './store'
import App from './app'
import setGlobal from './global';

setGlobal();

let root = document.getElementById('root');
if (!root) {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

ReactDOM.render(
  React.createElement(Provider,
    { store },
    React.createElement(App)),
  root
)
