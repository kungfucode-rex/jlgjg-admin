# -*- coding=utf8
from server.web.Utils import *
from server.db.Models import Sale
from server.web.service import Sale_S

class list_sale:
    def GET(self):
        try:
            return OK_Result('', {
                'list': Sale_S.list(web.input(pageOffset=0, pageLimit=10)),
                'total': Sale_S.listCount(web.input())
            })
        except:
            return Error_Result('查询失败')

class get_sale_by_id:
    def GET(self):
        try:
            return OK_Result('', Sale_S.getById(web.input()))
        except:
            return Error_Result()

class sale:
    def POST(self):
        try:
            paramsArr = json.loads(web.data())
            result = Sale_S.add(paramsArr)
            return OK_Result()
        except:
            return Error_Result()