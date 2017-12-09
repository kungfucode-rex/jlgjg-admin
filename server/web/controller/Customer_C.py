# -*- coding=utf8
from server.web.Utils import *
from server.db.Models import Customer
from server.web.service import Customer_S

class list_customer:
    def GET(self):
        try:
            return OK_Result('', {
                'list': Customer_S.list(web.input(pageOffset=0, pageLimit=10)),
                'total': Customer_S.listCount(web.input())
            })
        except:
            return Error_Result('查询失败')

class get_customer_by_id:
    def GET(self):
        try:
            return OK_Result('', Customer_S.getById(web.input()))
        except:
            return Error_Result()

class add_customer:
    def POST(self):
        params = toDict(json.loads(web.data()))
        result = Customer_S.add(params)
        if result != -1:
            return OK_Result()
        else:
            return Error_Result()

class delete_customer:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            customer = Customer(**params)
            Customer_S.delete(customer)
            return OK_Result()
        except:
            return Error_Result()

class edit_customer:
    def POST(self):
        try:
            params = toDict(json.loads(web.data()))
            customer = Customer_S.getById(params)
            newCustomer = Customer(**merge(customer, params))
            Customer_S.update(newCustomer)
            return OK_Result()
        except:
            return Error_Result()

class get_new_customer_no:
    def GET(self):
        try:
            return json.dumps({'no': Customer_S.getNewNo()})
        except:
            return Error_Result()