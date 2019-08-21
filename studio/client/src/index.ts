import { App } from '@/app';
import '@/assets/icon/iconfont.css';
import { ErrorBoundary } from '@/components/errorBoundary';
import '@/config';
import '@/lib/ajax';
import '@/store/createStore';
import { Provider, setConfig } from '@xeditor/editor';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

setConfig({
  requirejs: {
    waitSeconds: 0,
    baseUrl: window.config.packages,
    map: {
      '*': {
        css: `${window.config.packages}/require-css.js`
      }
    }
  },
  fontPath: ''
});

// 关闭确认
// window.onbeforeunload = function() {
//   return true;
// };

(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

ReactDOM.render(
  React.createElement(ErrorBoundary, null,
    React.createElement(Provider, null, React.createElement(App))
  ),
  document.getElementById('root')
);
