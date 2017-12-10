# -*- coding=utf8
from server.web.Utils import *
from server.db.Models import Buy
from server.web.service import Buy_S

class list_buy:
    def GET(self):
        try:
            return OK_Result('', {
                'list': Buy_S.list(web.input(pageOffset=0, pageLimit=10)),
                'total': Buy_S.listCount(web.input())
            })
        except:
            return Error_Result('查询失败')

class get_buy_by_id:
    def GET(self):
        try:
            return OK_Result('', Buy_S.getById(web.input()))
        except:
            return Error_Result()

class buy:
    def POST(self):
        try:
            paramsArr = json.loads(web.data())
            result = Buy_S.add(paramsArr)
            return OK_Result()
        except:
            return Error_Result()