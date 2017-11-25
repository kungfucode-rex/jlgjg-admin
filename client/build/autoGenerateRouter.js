/**
 * Created by user on 17/6/12.
 */
var fs = require('fs')
var path = require('path')

/**
 * 根据pages文件夹生成自动路由
 */
let genRoutesByPageFolder = function () {
  let routes = []
  let rootMenus = fs.readdirSync(path.resolve('src/pages'))
  // 遍历顶级菜单
  rootMenus.forEach( root => {
    if (root !== '.gitkeep') {
      let firstLevelMenus = fs.readdirSync(path.resolve('src/pages/' + root))
      // 遍历一级菜单
      firstLevelMenus.forEach(firstLevelMenu => {
        let secondLevelMenus = fs.readdirSync(path.resolve(`src/pages/${root}/${firstLevelMenu}`))
        // 遍历二级菜单
        secondLevelMenus.forEach(secondLevelMenu => {
          genRoutesInOneFolder(routes, `${root}/${firstLevelMenu}/${secondLevelMenu}`)
        })
      })
    }
  })
  return routes
}
/**
 * 处理指定文件夹的自生成路由
 */
let genRoutesInOneFolder = function (routes, folder) {
  let realFolder = `src/pages/${folder}`
  let files = fs.readdirSync(path.resolve(realFolder))
  // 如果有router.js文件，则读取
  let customerRoutes = null
  if (files.includes('router.json')) {
    let routerStr = fs.readFileSync(path.resolve(`${realFolder}/router.json`), 'utf-8')
    customerRoutes = JSON.parse(routerStr)
  }
  files.forEach(file => {
    // 如果是个Vue文件
    if (file.endsWith('.vue')) {
      let fileShortName = file.replace('.vue','')
      let path = ''
      if (customerRoutes && customerRoutes[fileShortName]){
        path = customerRoutes[fileShortName]
      }else {
        path = `/${folder}/${fileShortName}`
      }
      let name = folder.replace(/\//g,'_') + '_' + fileShortName
      routes.push({
        name: name,
        path: path,
        component: `pages/${folder}/${fileShortName}`
      })
    } else if (file.indexOf('.') === -1) {
      // 如果是个目录
      genRoutesInOneFolder(routes, folder + '/' + file)
    }
  })
}

let autoRoutes = genRoutesByPageFolder()
// 将自动生成的路由转成字符串
let autoRoutesStr = 'export default ['
autoRoutes.forEach( route => {
  autoRoutesStr += `
  {
    name: '${route.name}',
    path: '${route.path}',
    component: require('${route.component}')
  },`
})
if (autoRoutes.length > 0) {
  autoRoutesStr = autoRoutesStr.substr(0, autoRoutesStr.length - 1)
}
autoRoutesStr += `
]
`
fs.open('src/router/autoRoutes.js', 'w', function() {
  //将生成的内容写到router文件里去
  fs.open(path.resolve('src/router/autoRoutes.js'), 'w', function(err, fd) {
    fs.writeSync(fd, autoRoutesStr)
  })
});
