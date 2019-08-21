/* eslint-disable */
const config = require('../config');

module.exports = {
  entry: {
    app: config.entry
  },
  output: {
    path: config.dist,
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: config.publicPath
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/images/[name].[hash:7].[ext]'
          }
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/fonts/[name].[hash:7].[ext]'
          }
        }
      }, {
        test: /\.(avi|mp4|mov|asf|wmv|navi|3gp|mkv|flv|f4v|rmvb|webm|qsv|ogg)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/videos/[name].[hash:7].[ext]'
          }
        }
      }
    ]
  }
}
