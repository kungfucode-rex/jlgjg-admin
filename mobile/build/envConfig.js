// 配置开发或者编译的一些环境变量
var path = require('path')

module.exports = function (env) {
  return {
    production: {
      env: {
        NODE_ENV: '"production"'
      },
      offlineResource: true,
      index: path.resolve(__dirname, '../dist/jlgjgmobile/index.html'),
      assetsRoot: path.resolve(__dirname, '../dist/jlgjgmobile'),
      assetsSubDirectory: 'static',
      assetsPublicPath: '',
      sourceMap: 'hidden-source-map',
      // 是否启用Gzip压缩, 如需启用，请安装插件 npm install --save-dev compression-webpack-plugin
      productionGzip: false,
      // 需要Gzip压缩的文件的后缀名
      productionGzipExtensions: ['js', 'css'],
      devtool: 'hidden-source-map'
    },
    release: {
      env: {
        NODE_ENV: '"release"'
      },
      offlineResource: true,// 是否启用资源离线功能
      index: path.resolve(__dirname, '../release/index.html'),
      assetsRoot: path.resolve(__dirname, '../release'),
      assetsSubDirectory: 'static',
      assetsPublicPath: '',
      sourceMap: true,
      // 是否启用Gzip压缩, 如需启用，请安装插件 npm install --save-dev compression-webpack-plugin
      productionGzip: false,
      // 需要Gzip压缩的文件的后缀名
      productionGzipExtensions: ['js', 'css']
    },
    development: {
      env: {
        NODE_ENV: '"development"'
      },
      assetsRoot: path.resolve(__dirname, '../dist'),
      port: 8081,
      autoOpenBrowser: true,
      assetsSubDirectory: 'static',
      assetsPublicPath: '/',
      proxyTable: {},
      cssSourceMap: false,
      proxyConfig: {  // 使用代理解决跨域的问题
        use: 'test', // local使用本地服务代理 test使用测试服务代理
        paths: [
          {
            path: '/bcustomer', 
            localTarget: 'http://localhost:8083', 
            testTarget: 'https://es-test.95071222.net'
          }
        ]
      },
      mockServer: false
    }
  }[env]
}
