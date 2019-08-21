import { ICompiler } from '../../core/type';

const template = `import React from 'react'
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
`;

const compatible = `import 'whatwg-fetch';
import 'core-js';
import "regenerator-runtime/runtime";
`;

export function indexjsTemplateLoader(config: ICompiler) {
  if (config.config.compatible === true) {
    return compatible + '\n' + template;
  }
  return template;
}
