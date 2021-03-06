/**
 * Created by user on 17/6/7.
 */
import hmacSHA1 from 'crypto-js/hmac-sha1'
import Base64 from 'crypto-js/enc-base64'
import mOxie from '../../plugins/plupload-2.1.8/js/moxie'
window.mOxie = mOxie.mOxie
require('../../plugins/plupload-2.1.8/js/plupload.dev')
require('../../plugins/plupload-2.1.8/js/i18n/zh_CN')
require('qiniu-js')
const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
const base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1]
// 如果配置文件提供了 uptoken 就直接使用，否则需提供 accessKey、secretKey
// 如果都不提供，则会指定一个默认的7牛测试账号
import config from '../../config/config'
let qiniuConfig = config.qiniuConfig
let upPolicy = qiniuConfig.upPolicy
if (!upPolicy) {
  upPolicy = {
    scope: 'kungfucode-store',
    // mimeLimit: 'image/*;',
    deadline: 1565798400, // 2019-08-15
    returnBody: '{' +
    '"name": $(fname),' +
    '"size": $(fsize),' +
    '"w": $(imageInfo.width),' +
    '"h": $(imageInfo.height),' +
    '"hash": $(etag)' +
    '}'
  }
}
const accessKey = qiniuConfig.accessKey
const secretKey = qiniuConfig.secretKey

let QiniuUtil = {
  config: qiniuConfig,
  utf16to8 (str) {
    let out, i, len, c
    out = ''
    len = str.length
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      }
    }
    return out
  },
  utf8to16 (str) {
    var out, i, len, c
    var char2, char3
    out = ''
    len = str.length
    i = 0
    while (i < len) {
      c = str.charCodeAt(i++)
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += str.charAt(i - 1)
          break
        case 12:
        case 13:
          // 110x xxxx 10xx xxxx
          char2 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          // 1110 xxxx 10xx xxxx 10xx xxxx
          char2 = str.charCodeAt(i++)
          char3 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0))
          break
      }
    }
    return out
  },
  base64encode (str) {
    var out, i, len
    var c1, c2, c3
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = str.charCodeAt(i++)
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
        out += base64EncodeChars.charAt((c2 & 0xF) << 2)
        out += '='
        break
      }
      c3 = str.charCodeAt(i++)
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
      out += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return out
  },
  base64decode (str) {
    var c1, c2, c3, c4
    var i, len, out
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (i < len && c1 === -1)
      if (c1 === -1) break
      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (i < len && c2 === -1)
      if (c2 === -1) break
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 === 61) return out
        c3 = base64DecodeChars[c3]
      } while (i < len && c3 === -1)
      if (c3 === -1) break
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))
      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 === 61) return out
        c4 = base64DecodeChars[c4]
      } while (i < len && c4 === -1)
      if (c4 === -1) break
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return out
  },
  safe64 (base64) {
    base64 = base64.replace(/\+/g, '-')
    base64 = base64.replace(/\//g, '_')
    return base64
  },
  genUpToken (accessKey, secretKey, putPolicy) {
    // SETP 2
    let putPolicyStr = JSON.stringify(putPolicy)
    // console && console.log('put_policy = ', putPolicyStr)

    // SETP 3
    let encoded = this.base64encode(this.utf16to8(putPolicyStr))
    // console && console.log('encoded = ', encoded)

    // SETP 4
    let hash = hmacSHA1(encoded, secretKey)
    let encodedSigned = hash.toString(Base64)
    // console && console.log('encoded_signed=', encodedSigned)

    // SETP 5
    let uploadToken = accessKey + ':' + this.safe64(encodedSigned) + ':' + encoded
    // console && console.log('upload_token=', uploadToken)
    return uploadToken
  },
  upload (btnId, option) {
    // 计算token
    let uptoken = ''
    if (!qiniuConfig.uptokenUrl) {
      uptoken = qiniuConfig.uptoken ||
        this.genUpToken(accessKey, secretKey, upPolicy)
    }
    // eslint-disable-next-line no-undef
    let loader = Qiniu.uploader({
      runtimes: 'html5,flash,html4',      // 上传模式，依次退化
      browse_button: btnId,         // 上传选择的点选按钮，必需
      // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
      // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
      // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
      uptoken: option.uptoken || uptoken, // uptoken是上传凭证，由其他程序生成
      // uptoken_url: qiniuConfig.uptokenUrl,         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
      // uptoken_func: function(file){    // 在需要获取uptoken时，该方法会被调用
      //    // do something
      //    return uptoken
      // },
      get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
      // downtoken_url: '/downtoken',
      // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
      unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
      // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
      domain: qiniuConfig.domain,     // bucket域名，下载资源时用到，必需
      // container: 'haha',             // 上传区域DOM ID，默认是browser_button的父元素
      // max_file_size: '100mb',             // 最大文件体积限制
      filters: option.filters || {
        max_file_size: '100mb'
      },
      flash_swf_url: 'path/of/plupload/Moxie.swf',  // 引入flash，相对路径
      max_retries: 3,                     // 上传失败最大重试次数
      dragdrop: true,                     // 开启可拖曳上传
      drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: '4mb',                  // 分块上传时，每块的体积
      auto_start: option['auto_start'] || false,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      // x_vars : {
      //    查看自定义变量
      //    'time' : function(up,file) {
      //        var time = (new Date()).getTime()
      // do something with 'time'
      //        return time
      //    },
      //    'size' : function(up,file) {
      //        var size = file.size
      // do something with 'size'
      //        return size
      //    }
      // },
      init: {
        'FilesAdded': function (up, files) {
          option.FilesAdded(up, files)
        },
        'BeforeUpload': function (up, file) {
          // 每个文件上传前，处理相关的事情
          // return false
        },
        'UploadProgress': function (up, file) {
          option.UploadProgress(up, file)
          // console.log('UploadProgress: ' + file.name + ' ' + file.percent)
          // 每个文件上传时，处理相关的事情
        },
        'FileUploaded': function (up, file, info) {
          // 每个文件上传成功后，处理相关的事情
          // 其中info是文件上传成功后，服务端返回的json，形式如：
          // {
          //    'hash': 'Fh8xVqod2MQ1mocfI4S4KpRL6D98',
          //    'key': 'gogopher.jpg'
          //  }
          // 查看简单反馈
          // var domain = up.getOption('domain')
          // var res = parseJSON(info)
          // var sourceLink = domain +'/'+ res.key 获取上传成功后的文件的Url
          // callback(up.files, up.settings.browser_button)
        },
        'Error': function (up, err, errTip) {
          option.Error(up, err, errTip, option)
          // 上传出错时，处理相关的事情
        },
        'UploadComplete': function (up, files) {
          option.UploadComplete(up, files)
          // 队列文件处理完毕后，处理相关的事情
        },
        'Key': function (up, file) {
          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在unique_names: false，save_key: false时才生效
          // debugger
          var key = file.name
          // do something with key here
          return key
        }
      }
    })
    return loader
  }
}

export default QiniuUtil
