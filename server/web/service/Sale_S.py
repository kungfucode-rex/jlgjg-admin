# -*- coding=utf8
from server.db.Models import Sale
from server.db import DBUtil
import datetime, time
from server.web.Utils import *

def list(params):
    where = "where no like ? and customer_name like ? and goods_name like ? and creater_name like ? "
    no = '%' + params.no + '%'
    customer_name = '%' + params.customer_name + '%'
    goods_name = '%' + params.goods_name + '%'
    creater_name = '%' + params.creater_name + '%'
    pagestr = 'limit %s,%s' % (params.pageOffset, params.pageLimit)
    sales = None
    if params.start_time != '':
        where = where + " and createtime >= ? and createtime <= ?"
        sales = Sale.find_by(where + pagestr, no, customer_name, goods_name, creater_name, params.start_time, params.end_time)
    else:
        sales = Sale.find_by(where + pagestr, no, customer_name, goods_name, creater_name)
    return sales

def listCount(params):
    where = "where no like ? and customer_name like ? and goods_name like ? and creater_name like ? "
    no = '%' + params.no + '%'
    customer_name = '%' + params.customer_name + '%'
    goods_name = '%' + params.goods_name + '%'
    creater_name = '%' + params.creater_name + '%'
    total = None
    if params.start_time != '':
        where = where + " and createtime >= ? and createtime <= ?"
        total = Sale.count_by(where, no, customer_name, goods_name, creater_name, params.start_time, params.end_time)
    else:
        total = Sale.count_by(where, no, customer_name, goods_name, creater_name)
    return total

def getById(params):
    return Sale.get(params.id)

def getByNo(params):
    return Sale.find_by('where no = ?', params.no)

def add(paramsArr):
    newNo = 'SALE' + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    for params in paramsArr:
        params = toDict(params)
        sale = Sale(
            id=DBUtil.next_id(),
            no=newNo,
            customer_no=params.customer_no,
            customer_name=params.customer_name,
            goods_no=params.goods_no,
            goods_name=params.goods_name,
            goods_guige=params.goods_guige,
            goods_unit=params.goods_unit,
            quantity=params.quantity,
            price=params.price,
            money=params.money,
            # aprice_before=params.aprice_before,
            # aprice_after=params.aprice_after,
            creater=params.creater,
            creater_name=params.creater_name,
            createtime=int(time.time() * 1000)
        )
        sale.insert()

def update(sale):
    return sale.update()

def delete(sale):
    return sale.delete()
