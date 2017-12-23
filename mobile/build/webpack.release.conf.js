require('./check-versions')()                                             //检查node版本
process.env.NODE_ENV = 'release'                                          //设置环境变量为生产环境
var envConfig = require('./envConfig')(process.env.NODE_ENV)              //获取生产环境变量配置
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var rm = require('rimraf').sync
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var X2OfflineResourcePlugin = require('./X2OfflineResourcePlugin')        // 自定义webpack插件, 用于资源离线功能

rm(path.join(envConfig.assetsRoot, envConfig.assetsSubDirectory))         //删除旧代码
var webpackConfig = merge(baseWebpackConfig, {                            //合并出新的webpack配置
  devtool: 'source-map',
  output: {
    path: envConfig.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    new OptimizeCSSPlugin({                                               // 去除重复的css
      cssProcessorOptions: {
        safe: true
      }
    }),
    new HtmlWebpackPlugin({  
      favicon: path.resolve(__dirname, '../favicon.ico'),                                             
      filename: envConfig.index,                                          //配置输出的index.html
      template: envConfig.offlineResource === true ? 'indexOfflineResource.html' : 'index.html', //如果不离线资源使用 index.html
      inject: envConfig.offlineResource === true ? false : true,          // 如果离线资源则不注入
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({                             // 提取代码中的公共模块，然后将公共模块打包到一个独
      name: 'vendor',                                                     // 立的文件中去，以便在其它的入口和模块中使用
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({                             // 防止有变化时全部更新
      name: 'manifest',
      chunks: ['vendor']
    }),
    new CopyWebpackPlugin([                                               // 拷贝静态资源到目标文件夹中
      {
        from: path.resolve(__dirname, '../static'),
        to: envConfig.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new X2OfflineResourcePlugin()                                         // 处理资源离线功能
  ]
})
if (envConfig.productionGzip) {                                           // 判断是否启动Gzip压缩
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        envConfig.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
module.exports = webpackConfig
