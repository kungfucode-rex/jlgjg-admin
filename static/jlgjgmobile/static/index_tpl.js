/**
 * Created by kungfucode on 17/9/19.
 */
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
// 之前的版本信息
var oldVersions = {}
// 定义数据信息
var X2DBBgResources = {
  name: 'JLDB',
  storeName: 'bgResources',
  version: timestampVersion,// 每次发版都会生成一个新的数据库版本(时间戳秒数)
  db: null,
  resourcesArr: [
    // id 是indexedDB中的keyPath
    // url 会换成新的hashUrl
    // type style:样式文件, script:脚本文件
    // 这里的顺序就是资源在页面加载的顺序
    // {id: 'app.css', url: 'static/jlgjgmobile/static/css/app', type: 'style'},
    {id: 'manifest.js', url: 'static/jlgjgmobile/static/js/manifest', type: 'script'},
    {id: 'vendor.js', url: 'static/jlgjgmobile/static/js/vendor', type: 'script'},
    {id: 'app.js', url: 'static/jlgjgmobile/static/js/app', type: 'script'}
  ]
}
// 是否需要更新版本, 如果需要更新的话, 不会去使用数据库中的资源到页面
var needUpdate = false
// 创建一个XHR对象, 用于封装AJAX请求
function createXHR () {
  if (typeof XMLHttpRequest !== 'undefined') { // 非IE6浏览器
    return new XMLHttpRequest()
  } else if (typeof ActiveXObject !== 'undefined') {   // IE6浏览器
    var version = [
      'MSXML2.XMLHttp.6.0',
      'MSXML2.XMLHttp.3.0',
      'MSXML2.XMLHttp'
    ]
    for (var i = 0; i < version.length; i++) {
      try {
// eslint-disable-next-line no-undef
        return new ActiveXObject(version[i])
      } catch (e) {
        // 跳过
      }
    }
  } else {
    throw new Error('您的系统或浏览器不支持XHR对象！')
  }
}
// 转义字符
function params (data) {
  var arr = []
  for (var i in data) {
    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]))
  }
  return arr.join('&')
}
// 封装ajax
function x2Ajax (obj) {
  var xhr = createXHR()
  obj.url = obj.url + '?rand=' + Math.random() // 清除缓存
  obj.data = params(obj.data)      // 转义字符串
  if (obj.method === 'get') {      // 判断使用的是否是get方式发送
    obj.url += obj.url.indexOf('?') === -1 ? '?' + obj.data : '&' + obj.data
  }
  // 异步
  if (obj.async === true) {
    // 异步的时候需要触发onreadystatechange事件
    xhr.onreadystatechange = function () {
      // 执行完成
      if (xhr.readyState === 4) {
        callBack()
      }
    }
  }
  xhr.open(obj.method, obj.url, obj.async)
  if (obj.method === 'post') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(obj.data)
  } else {
    xhr.send(null)
  }
  // xhr.abort(); // 取消异步请求
  // 同步
  if (obj.async === false) {
    callBack()
  }
  // 返回数据
  function callBack () {
    // 判断是否返回正确
    if (xhr.status === 200) {
      obj.success(xhr.responseText)
    } else {
      obj.Error('获取数据失败，错误代号为：' + xhr.status + '错误信息为：' + xhr.statusText)
    }
  }
}
// 数据库工具类
var DBUtil = {
  openDB: function (DBInfo, successCB) {
    var requestDB = window.indexedDB.open(DBInfo.name, DBInfo.version)
    requestDB.onsuccess = function (e) {
      DBInfo.db = e.target.result
      successCB()
    }
    requestDB.onerror = function (e) {
      console.log(e.currentTarget.error.message)
    }
    requestDB.onupgradeneeded = function (e) {
      needUpdate = true
      console.log('更新版本')
      var db = e.target.result
      // 如果没有表, 则初始化
      if (!db.objectStoreNames.contains(DBInfo.storeName)) {
        db.createObjectStore(DBInfo.storeName, {keyPath: 'id'})
      }
      let img = document.createElement('img')
      img.src = '/static/images/view-loader.gif'
      let p = document.createElement('p')
      p.id = 'updateInfo'
      p.innerHTML = '数据更新中......'
      let div = document.createElement('div')
      div.style.width = '100%'
      div.style.height = '100%'
      div.style.display = 'flex'
      div.style.justifyContent = 'center'
      div.style.alignItems = 'center'
      div.style.flexDirection = 'column'
      div.appendChild(img)
      div.appendChild(p)
      document.body.appendChild(div)
      // 重新装载数据
      loadResources(DBInfo.resourcesArr, function () {
        let p = document.getElementById('updateInfo')
        p.innerHTML = '数据更新成功^_^!'
        p.style.color = 'green'
        console.log('版本成功更新为:' + db.version)
        // 资源更新后重新加载页面, 留一秒钟, 怕数据没有完全入库时页面刷新
        setTimeout(function () {
          window.location.reload()
        }, 1000)
      })
    }
  },
  // 往数据库 db 里的"表" storeName 中, 加入数组 dataArr 中的数据
  addData: function (db, storeName, dataArr) {
    var transaction = db.transaction(storeName, 'readwrite')
    var store = transaction.objectStore(storeName)
    for (var i = 0; i < dataArr.length; i++) {
      store.put(dataArr[i])
    }
  },
  closeDB: function (db) {
    db.close()
  },
  deleteDB: function (name) {
    indexedDB.deleteDatabase(name)
  },
  getDataByKey: function (db, storeName, key, successCB) {
    var transaction = db.transaction(storeName, 'readwrite')
    var store = transaction.objectStore(storeName)
    var request = store.get(key)
    request.onsuccess = function (e) {
      successCB(e.target.result)
    }
  }
}

// 请求资源到本地数组
function loadResources (resourcesArr, successCB) {
  // 定义需要更新的资源数组
  let needUpdateFiles = []
  resourcesArr.forEach(item => {
    // 跟旧版本的资源比较, 如果url不一样, 就加到待更新资源数组里
    if (item.url !== oldVersions[item.id]) {
      needUpdateFiles.push(item)
    }
  })
  // 定义请求的次数
  let count = 0
  needUpdateFiles.forEach(item => {
    x2Ajax({
      url: item.url,
      method: 'get',
      async: true,
      success: function (data) {
        console.log('请求 ' + item.id + ' 成功')
        item.data = data
        count = count + 1
        // 从url加载资源完毕, 即请求成功的次数等于更新资源数
        if (count === needUpdateFiles.length) {
          console.log('请求资源完成')
          // 如果支持indexedDB, 则将新的数据存储到数据库
          if (window.indexedDB) {
            DBUtil.addData(X2DBBgResources.db, 'bgResources', needUpdateFiles)
          }
          successCB()
        }
      },
      Error: function (error) {
        DBUtil.deleteDB(X2DBBgResources.name)
      }
    })
  })
}
// 将资源加载到页面
function loadResourcesToDocument (resourcesArr) {
  resourcesArr.forEach(item => {
    if (item.type === 'style') {
      let styleNode = document.createElement('style')
      styleNode.innerHTML = item.data
      document.head.appendChild(styleNode)
    } else if (item.type === 'script') {
// eslint-disable-next-line no-eval
      eval(item.data)
    }
  })
}
function useIndexedDBData () {
  // 直接获取数据库里的数据
  DBUtil.openDB(X2DBBgResources, function () {
    console.log('读取数据')
    // 如果资源版本需要更新,则先不去数据库读取资源
    if (needUpdate) return
    // 假设读取数据库时没有发生错误
    let hasError = false
    X2DBBgResources.resourcesArr.forEach((item, index) => {
      !hasError && DBUtil.getDataByKey(X2DBBgResources.db, X2DBBgResources.storeName, item.id, function (data) {
        try {
          // 将数据库的数据先存储到 X2DBBgResources.resourcesArr
          item.data = data.data
          if (index === X2DBBgResources.resourcesArr.length - 1) {
            // 将数据全部读取时, 将其加到页面中
            loadResourcesToDocument(X2DBBgResources.resourcesArr)
          }
        } catch (e) {
          console.log('离线资源 ' + item.id + ' 损坏')
          hasError = true
        } finally {
          // 遍历到最后
          if (index === X2DBBgResources.resourcesArr.length - 1) {
            // 如果有错误
            if (hasError) {
              // 删掉数据库重新加载页面请求数据
              DBUtil.deleteDB(X2DBBgResources.name)
              let reloadLink = document.createElement('a')
              reloadLink.innerHTML = '点击重试'
              reloadLink.onclick = function () {
                window.location.reload()
              }
              document.body.appendChild(reloadLink)
            }
          }
        }
      })
    })
  })
}
// 程序入口:判断是否支持indexedDB
if (window.indexedDB) {
  // 获取之前的版本信息
  var requestDB = window.indexedDB.open(X2DBBgResources.name)
  requestDB.onsuccess = function (e) {
    let db = e.target.result
    var transaction = db.transaction(X2DBBgResources.storeName, 'readwrite')
    var store = transaction.objectStore(X2DBBgResources.storeName)
    let count = 0
    X2DBBgResources.resourcesArr.forEach(item => {
      var request = store.get(item.id)
      request.onsuccess = function (e) {
        oldVersions[item.id] = e.target.result.url
        count++
        if (count === X2DBBgResources.resourcesArr.length) {
          console.log('获取版本信息成功:')
          console.log(oldVersions)
          db.close()
          useIndexedDBData()
        }
      }
    })
  }
  requestDB.onupgradeneeded = function (e) {
    var db = e.target.result
    // 如果走到这里说明还没有数据库, 则不用判断旧版本
    db.close()
    useIndexedDBData()
  }
} else {
  loadResources(X2DBBgResources.resourcesArr, function () {
    loadResourcesToDocument(X2DBBgResources.resourcesArr)
  })
}
