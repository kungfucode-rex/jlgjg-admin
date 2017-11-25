process.env.NODE_ENV = 'development'              //设置环境变量为开发环境
require('./check-versions')()                     //检查node版本
var path = require('path')
var opn = require('opn')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var envConfig = require('./envConfig')(process.env.NODE_ENV)           //获取环境变量配置
// this is a test for hotfix branch
// 启一个服务, 专门用来mock数据
if (envConfig.mockServer === true) {
  require('./mockServer')
}
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var baseWebpackConfig = require('./webpack.base.conf')
module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      injet: true
    })
  ],
  watch: true,
  devServer: {
    contentBase: path.resolve(__dirname,'..'),
    port: envConfig.port,
    hot: true,
    watchOptions: {
      poll: 1000
    },
    overlay: true
  }
});
