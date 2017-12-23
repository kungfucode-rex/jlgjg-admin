/**
 * Created by kungfucode on 17/9/20.
 */
//设置环境变量为生产环境
var envConfig = require('./envConfig')(process.env.NODE_ENV)
var fs = require('fs')
var path = require('path')
function IndexPlugin () {
}
IndexPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    // 需要离线的资源id(url前缀)
    let resourcesVersionArr = [
      'static/css/app',
      'static/js/manifest',
      'static/js/vendor',
      'static/js/app'
    ]
    // 组装的资源信息集合{id: url}
    let resourcesUrlMap = {}
    // 遍历webpack处理后的所有资源
    for (var url in compilation.assets) {
      resourcesVersionArr.forEach(id => {
        // 找出需要的资源
        if (url.startsWith(id)) {
          // 将其url存储到集合里
          resourcesUrlMap[id] = url.replace('.map','')
        }
      })
    }
    // 读取模板文件内容 index_tpl.js
    let indexJsStr = fs.readFileSync(path.resolve(`static/index_tpl.js`), 'utf-8')
    fs.open(envConfig.assetsSubDirectory + '/index.js', 'w', function (err, fd) {
      if (err) console.log(err)
      resourcesVersionArr.forEach(id => {
        // 将其中的资源id(url前缀)用我们获取的新url将其替换
        indexJsStr = indexJsStr.replace(id, resourcesUrlMap[id])
      })
      // 更新数据库版本号(时间戳)
      indexJsStr = indexJsStr.replace('timestampVersion', Number((new Date().getTime()).toString().substr(0,10)))
      // 将新的内容写入到 static/index.js 中
      fs.writeFile(fd, indexJsStr, callback)
    })

  })
}
module.exports = IndexPlugin
