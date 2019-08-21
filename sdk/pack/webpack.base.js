const path = require('path');

module.exports = function (config) {
  let envConfig = {};
  if (config.compatible === true) {
    envConfig = {
      "targets": {
        "chrome": config.compatible ? 40 : 52,
        "ie": "11"
      }
    };
  } else {
    envConfig = {
      "targets": {
        "chrome": 52
      }
    };
  }
  return {
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
      extensions: ['.js', '.json', '.jsx'],
      modules: [path.resolve(__dirname, 'node_modules')]
    },
    context: __dirname,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  require("@babel/preset-env").default,
                  envConfig
                ],
                require("@babel/preset-react").default,
              ],
              plugins: [
                [
                  require("babel-plugin-import").default,
                  {
                    "libraryName": "antd",
                    "style": "css",
                    "libraryDirectory": "es"
                  }
                ],
                [require("@babel/plugin-proposal-decorators").default, { "legacy": true }],
                [require("@babel/plugin-proposal-class-properties").default, { "loose": true }]
              ]
            }
          }
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
            loader: 'url-loader'
          }
        }, {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: {
            loader: 'url-loader'
          }
        }, {
          test: /\.(avi|mp4|mov|asf|wmv|navi|3gp|mkv|flv|f4v|rmvb|webm|qsv|ogg)(\?.*)?$/i,
          use: {
            loader: 'url-loader'
          }
        }
      ]
    }
  }
}
