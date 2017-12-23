# -*- coding:utf8
import web, time, hashlib
from conf.config import configs
from server.db.Models import User
from server.web.Utils import OK_Result, Error_Result, get_user_by_cookie

_COOKIE_NAME = configs.cookie.name

#除登录页和静态资源以外, 其它请求都必须登录认证
def loginFilter(handler):
    web.config._session['keepsession'] = True
    web.header("Access-Control-Allow-Origin", "http://10.8.10.117:8081")
    web.header("Access-Control-Allow-Credentials", 'true')
    web.header("Access-Control-Allow-Headers", 'Content-Type')
    web.header("Access-Control-Allow-Methods", 'POST')
    result = None
    if web.ctx.method in ['OPTIONS']:
        response = web.storage()
        response.status = 200
        return response
    if not (web.ctx.path in configs.safePath or web.ctx.path.startswith('/static')):
        web.header('Content-Type', 'application/json')
        user = None
        cookie = web.cookies().get(_COOKIE_NAME)
        if cookie:
            user = get_user_by_cookie(cookie)
        if user == None:
            print '没有登录'
            result = Error_Result('请登录', [], 401)
        else:
            print '已登录'
            result = handler()
    else:
        result = handler()
    return result


