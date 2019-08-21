const path = require('path');
module.exports = {
  entry: path.resolve(__dirname, '..', 'src/index.tsx'),
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '..', 'lib'),
    filename: 'index.js',
    library: "@xeditor/layer",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  externals: ['react', 'react-dnd', 'lite-ui',　'evt-emit', '@xeditor/plugin-layer', '@xeditor/core'], 
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
          {
            loader: 'tslint-loader',
            options: {
              tsConfigFile: path.join(__dirname, '../tsconfig.json'),
              configFile: path.join(__dirname, '../tslint.json')
            }
          }
        ]
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/img/[name].[hash:7].[ext]'
          }
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/fonts/[name].[hash:7].[ext]'
          }
        }
      }
    ]
  }
};