require('./autoGenerateRouter')                   //自动生成路由
var path = require('path')
var webpack = require('webpack')
var utils = require('./utils')
var envConfig = require('./envConfig')(process.env.NODE_ENV)
var apiConfig = require('../config/apiConfig')(process.env.NODE_ENV)      //获取相应环境的请求列表
var ExtractTextPlugin = require('extract-text-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: envConfig.assetsRoot,
    filename: '[name].js',
    publicPath: envConfig.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'components': resolve('src') + '/components',
      'pages': resolve('src') + '/pages',
      'config': resolve('config'),
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            stylus: 'style-loader!css-loader!postcss-loader!stylus-loader',
            less: 'style-loader!css-loader!postcss-loader!less-loader',
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', 'postcss-loader' ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('config'), resolve('test')],
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(apiConfig),
    new webpack.DefinePlugin({                                 //将apiConfig和env混合到全局变量中
      'process.env': envConfig.env
    })
  ]
}
