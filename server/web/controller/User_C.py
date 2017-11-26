# -*- coding=utf8
from server.db.Models import User
from server.web.service import User_S
import web, time, hashlib, json
from conf.config import configs
from server.web.Utils import OK_Result, Error_Result

_COOKIE_NAME = configs.cookie.name
_COOKIE_KEY = configs.session.secret


# 列表
class list_user:
    def GET(self):
        return User_S.list(web.input(offset=0, limit=10))


# getById
class get_user_by_id:
    def GET(self):
        return User_S.getById(web.input())


# 新增
class add_user:
    def POST(self):
        result = User_S.add(web.input())
        if result != -1:
            return OK_Result('新增用户成功')
        else:
            return Error_Result('新增用户失败')


class login:
    def POST(self):
        msg = ''
        params = json.loads(web.data())
        user = User.find_first('where name=?', (params['username']))
        if user is None:
            msg = '此用户不存在'
        elif user.password != params['password']:
            msg = '用户验证失败'
        max_age = 604800
        cookie = make_signed_cookie(user.id, user.password, max_age)
        web.setcookie(_COOKIE_NAME, cookie, max_age)
        if msg == '':
            return OK_Result('用户验证成功', [user])
        else:
            return Error_Result('用户验证失败')


def make_signed_cookie(id, password, max_age):
    expires = str(int(time.time() + max_age))
    L = [id, expires, hashlib.md5('%s-%s-%s-%s' % (id, password, expires, _COOKIE_KEY)).hexdigest()]
    return '-'.join(L)
