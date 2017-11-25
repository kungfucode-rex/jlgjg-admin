// This is the webpack config used for unit tests.

require('./check-versions')()                                             //检查node版本
process.env.NODE_ENV = 'production'                                       //设置环境变量为生产环境
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')

var webpackConfig = merge(baseWebpackConfig, {
  // use inline sourcemap for karma-sourcemap-loader
  module: {
    rules: utils.styleLoaders()
  },
  devtool: '#inline-source-map',
  resolveLoader: {
    alias: {
      // necessary to to make lang="scss" work in test when using vue-loader's ?inject option
      // see discussion at https://github.com/vuejs/vue-loader/issues/724
      'scss-loader': 'sass-loader'
    }
  }
});

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig
