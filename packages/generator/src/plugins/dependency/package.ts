export function packageTemplate(dependencies: string) {
  return `
  {
    "name": "hy",
    "version": "1.0.0",
    "main": "./src/index.js",
    "scripts": {
      "start": "node ./build/devServer.js",
      "build": "webpack-cli --config ./build/webpack/webpack.prod.js"
    },
    "dependencies": {
      "react": "16.8.6",
      "immutability-helper":"3.0.1",
      "react-dom": "16.8.6"${dependencies.length !== 0 ? ',' : ''}
      ${dependencies}
    },
    "devDependencies": {
      "@babel/plugin-proposal-class-properties": "7.5.5",
      "@babel/plugin-proposal-decorators": "7.4.4",
      "@babel/core": "7.5.5",
      "babel-loader": "8.0.6",
      "babel-plugin-import": "1.12.0",
      "@babel/preset-env": "7.5.5",
      "@babel/preset-react": "7.0.0",
      "clean-webpack-plugin": "3.0.0",
      "copy-webpack-plugin": "5.0.4",
      "css-loader": "3.1.0",
      "express": "4.17.1",
      "file-loader": "4.1.0",
      "html-webpack-plugin": "3.2.0",
      "opn": "6.0.0",
      "sass-loader": "7.1.0",
      "style-loader": "0.23.1",
      "url-loader": "2.1.0",
      "webpack": "4.39.1",
      "webpack-cli": "3.3.6",
      "webpack-dev-middleware": "3.7.0",
      "webpack-merge": "4.2.1",
      "node-sass": "4.12.0"
    }
  }`;
}
