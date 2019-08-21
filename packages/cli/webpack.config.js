const path = require('path');
const basePresets = [
  require('@babel/preset-env'),
  require('@babel/preset-react')
];

module.exports = {
  entry: path.join(__dirname,'./components/evtBtn/v1.0'),
  mode: 'production',
  context: __dirname,
  output: { filename: 'xxxx', path:path.join(__dirname,'./dist'), libraryTarget: 'amd' },
  devtool: 'productiton' === 'production' ? 'none' : 'inline-source-map',
  externals: ['react', 'react-dom', 'echarts', 'd3', 'css!antd', 'antd', 'immutability-helper', 'lodash', 'jquery', 'echarts-gl'],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: basePresets,
            plugins: [
              [require('@babel/plugin-proposal-decorators'), { "legacy": true }],
              [require('@babel/plugin-proposal-class-properties'), { "loose": true }]
            ]
          }
        }
      },
      {
        test: path.join(__dirname,'./components/evtBtn/v1.0/index.jsx'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: basePresets,
            plugins: [
              require('@xeditor/babel-plugin-editor'),
              [require('@babel/plugin-proposal-decorators'), { "legacy": true }],
              [require('@babel/plugin-proposal-class-properties'), { "loose": true }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
      }
    ]
  }
};