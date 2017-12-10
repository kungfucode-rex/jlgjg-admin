# -*- coding=utf8
from server.web.Utils import *
from server.db.Models import Provider
from server.web.service import Provider_S

class list_provider:
    def GET(self):
        try:
            result = OK_Result('', {
                'list': Provider_S.list(web.input(pageOffset=0, pageLimit=10)),
                'total': Provider_S.listCount(web.input())
            })
            return result
        except:
            return Error_Result('查询失败')

class blur_query_provider_by_name:
    def GET(self):
        try:
            return OK_Result('', Provider_S.blurQueryByName(web.input()))
        except:
            return Error_Result()

# getById
class get_provider_by_id:
    def GET(self):
        try:
            return OK_Result('', Provider_S.getById(web.input()))
        except:
            return Error_Result()

class add_provider:
    def POST(self):
        params = toDict(json.loads(web.data()))
        result = Provider_S.add(params)
        if result != -1:
            return OK_Result()
        else:
            return Error_Result()

class delete_provider:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            provider = Provider(**params)
            Provider_S.delete(provider)
            return OK_Result()
        except:
            return Error_Result()

class edit_provider:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            provider = Provider_S.getById(params)
            newProvider = Provider(**merge(provider, params))
            Provider_S.update(newProvider)
            return OK_Result()
        except:
            return Error_Result()

class get_new_provider_no:
    def GET(self):
        try:
            return json.dumps({'no': Provider_S.getNewNo()})
        except:
            return Error_Result()
