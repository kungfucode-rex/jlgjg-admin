# -*- coding=utf8
from server.web.Utils import *
from server.db.Models import Taizhang
from server.web.service import Taizhang_S

class list_taizhang:
    def GET(self):
        try:
            return OK_Result('', {
                'list': Taizhang_S.list(web.input(pageOffset=0, pageLimit=10)),
                'total': Taizhang_S.listCount(web.input())
            })
        except:
            return Error_Result('查询失败')

class get_taizhang_by_id:
    def GET(self):
        try:
            return OK_Result('', Taizhang_S.getById(web.input()))
        except:
            return Error_Result()

class add_taizhang:
    def POST(self):
        params = toDict(json.loads(web.data()))
        result = Taizhang_S.add(params)
        if result != -1:
            return OK_Result()
        else:
            return Error_Result()

class delete_taizhang:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            taizhang = Taizhang(**params)
            Taizhang_S.delete(taizhang)
            return OK_Result()
        except:
            return Error_Result()

class edit_taizhang:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            taizhang = Taizhang_S.getById(params)
            newTaizhang = Taizhang(**merge(taizhang, params))
            Taizhang_S.update(newTaizhang)
            return OK_Result()
        except:
            return Error_Result()