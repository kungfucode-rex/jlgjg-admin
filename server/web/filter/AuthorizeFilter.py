# -*- coding:utf8
import web, time, hashlib
from conf.config import configs
from server.db.Models import User
from server.web.Utils import OK_Result, Error_Result

_COOKIE_NAME = configs.cookie.name
_COOKIE_KEY = configs.session.secret

#除登录页和静态资源以外, 其它请求都必须登录认证
def loginFilter(handler):
    result = None
    if not (web.ctx.path in configs.safePath or web.ctx.path.startswith('/static')):
        web.header('Content-Type', 'application/json')
        user = None
        cookie = web.cookies().get(_COOKIE_NAME)
        if cookie:
            user = parse_signed_cookie(cookie)
        if user == None:
            print '没有登录'
            result = Error_Result('请登录')
        else:
            print '已登录'
            result = handler()
    else:
        result = handler()
    return result


def parse_signed_cookie(cookie_str):
    try:
        L = cookie_str.split('-')
        if len(L) != 3:
            return None
        id, expires, md5 = L
        if int(expires) < time.time():
            return None
        user = User.get(id)
        if user is None:
            return None
        if md5 != hashlib.md5('%s-%s-%s-%s' % (id, user.password, expires, _COOKIE_KEY)).hexdigest():
            return None
        return user
    except:
        return None
