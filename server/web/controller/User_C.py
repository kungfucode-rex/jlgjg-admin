# -*- coding=utf8
from server.db.Models import User
from server.web.service import User_S
import web, time, hashlib, json
from conf.config import configs
from server.web.Utils import OK_Result, Error_Result, get_user_by_cookie

_COOKIE_NAME = configs.cookie.name
_COOKIE_KEY = configs.session.secret


# 列表
class list_user:
    def GET(self):
        try:
            return OK_Result('',{
                'list': User_S.list(web.input(pageOffset=0, pageLimit=10)),
                'total': User_S.listCount(web.input())
            })
        except:
            return Error_Result('查询失败')


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
        if params['validateCode'].lower() != web.config._session['validateCode'].lower():
            msg = '验证码不正确'
        elif user is None:
            msg = '此用户不存在'
        elif user.password != params['password']:
            msg = '用户或密码错误'
        if msg == '':
            max_age = 604800
            cookie = make_signed_cookie(user.id, user.password, max_age)
            web.setcookie(_COOKIE_NAME, cookie, max_age)
            return OK_Result('用户验证成功', user)
        else:
            return Error_Result(msg)


class get_user:
    def GET(self):
        return OK_Result('获取用户成功', get_user_by_cookie(web.cookies().get(_COOKIE_NAME)))


class login_out:
    def GET(self):
        web.setcookie(_COOKIE_NAME, '', 0)
        return OK_Result('注销成功')


def make_signed_cookie(id, password, max_age):
    expires = str(int(time.time() + max_age))
    L = [id, expires, hashlib.md5('%s-%s-%s-%s' % (id, password, expires, _COOKIE_KEY)).hexdigest()]
    return '-'.join(L)
