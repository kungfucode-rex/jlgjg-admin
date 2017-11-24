# -*- coding=utf8
from server.db.Models import User
from server.web.service import User_S
import web
from server.web.Utils import OK_Result, Error_Result

#列表
class list_user:
    def GET(self):
        web.header('Content-Type', 'application/json')
        return User_S.list(web.input(offset=0, limit=10))

#getById
class get_user_by_id:
    def GET(self):
        web.header('Content-Type', 'application/json')
        return User_S.getById(web.input())

#新增
class add_user:
    def POST(self):
        web.header('Content-Type', 'application/json')
        result = User_S.add(web.input())
        if result != -1:
            return OK_Result('新增用户成功')
        else:
            return Error_Result('新增用户失败')


