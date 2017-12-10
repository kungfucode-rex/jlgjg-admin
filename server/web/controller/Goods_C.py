# -*- coding=utf8
from server.web.Utils import *
from server.db.Models import Goods
from server.web.service import Goods_S

class list_goods:
    def GET(self):
        try:
            result = OK_Result('', {
                'list': Goods_S.list(web.input(pageOffset=0, pageLimit=10)),
                'total': Goods_S.listCount(web.input())
            })
            return result
        except:
            return Error_Result('查询失败')

# getById
class get_goods_by_id:
    def GET(self):
        try:
            return OK_Result('', Goods_S.getById(web.input()))
        except:
            return Error_Result()

class blur_query_goods_by_name:
    def GET(self):
        try:
            return OK_Result('', Goods_S.blurQueryByName(web.input()))
        except:
            return Error_Result()

class add_goods:
    def POST(self):
        params = toDict(json.loads(web.data()))
        result = Goods_S.add(params)
        if result != -1:
            return OK_Result()
        else:
            return Error_Result()

class delete_goods:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            goods = Goods(**params)
            Goods_S.delete(goods)
            return OK_Result()
        except:
            return Error_Result()

class edit_goods:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            goods = Goods_S.getById(params)
            newGoods = Goods(**merge(goods, params))
            Goods_S.update(newGoods)
            return OK_Result()
        except:
            return Error_Result()
