# -*- coding=utf8
from server.db.Models import Sale
import datetime, time
from server.web.Utils import *
from server.db.DBUtil import *
from server.db.Models import Taizhang
from server.web.service import Goods_S
from server.web.service import Taizhang_S

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

@with_transaction
def add(paramsArr):
    try:
        newNo = 'S' + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        for params in paramsArr:
            params = toDict(params)
            tempTime = int(time.time() * 1000)
            goods = Goods_S.getByNo(toDict({'no': params.goods_no}))
            beforeAprice = goods.aprice
            # 更新库存
            goods.quantity = goods.quantity - float(params.quantity)
            goods.money = goods.money - float(params.money)
            if (goods.quantity == 0):
                goods.aprice = 0
            else:
                goods.aprice = goods.money / goods.quantity
            afterAprice = goods.aprice
            sale = Sale(
                id=next_id(),
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
                aprice_before=beforeAprice,
                aprice_after=afterAprice,
                creater=params.creater,
                creater_name=params.creater_name,
                createtime=tempTime
            )
            # 新增台账
            taizhang = Taizhang(
                id = next_id(),
                no = Taizhang_S.getNewNo(),
                time = tempTime,
                deal_no = newNo,
                goods_no = params.goods_no,
                goods_name = params.goods_name,
                goods_guige = params.goods_guige,
                sale_quantity = params.quantity,
                sale_price = params.price,
                sale_money = params.money,
                store_quantity = goods.quantity,
                store_money = goods.money,
                store_aprice = goods.aprice,
                comment = params.comment
            )
            taizhang.insert()
            goods.update()
            sale.insert()
    except:
        print '购买失败'

def update(sale):
    return sale.update()

def delete(sale):
    return sale.delete()
