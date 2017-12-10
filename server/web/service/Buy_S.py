# -*- coding=utf8
from server.db.Models import Buy
from server.db import DBUtil
import datetime, time
from server.web.Utils import *

def list(params):
    where = "where no like ? and provider_name like ? and goods_name like ? and creater_name like ? "
    no = '%' + params.no + '%'
    provider_name = '%' + params.provider_name + '%'
    goods_name = '%' + params.goods_name + '%'
    creater_name = '%' + params.creater_name + '%'
    pagestr = 'limit %s,%s' % (params.pageOffset, params.pageLimit)
    buys = None
    if params.start_time != '':
        where = where + " and createtime >= ? and createtime <= ?"
        buys = Buy.find_by(where + pagestr, no, provider_name, goods_name, creater_name, params.start_time, params.end_time)
    else:
        buys = Buy.find_by(where + pagestr, no, provider_name, goods_name, creater_name)
    return buys

def listCount(params):
    where = "where no like ? and provider_name like ? and goods_name like ? and creater_name like ? "
    no = '%' + params.no + '%'
    provider_name = '%' + params.provider_name + '%'
    goods_name = '%' + params.goods_name + '%'
    creater_name = '%' + params.creater_name + '%'
    total = None
    if params.start_time != '':
        where = where + " and createtime >= ? and createtime <= ?"
        total = Buy.count_by(where, no, provider_name, goods_name, creater_name, params.start_time, params.end_time)
    else:
        total = Buy.count_by(where, no, provider_name, goods_name, creater_name)
    return total

def getById(params):
    return Buy.get(params.id)

def getByNo(params):
    return Buy.find_by('where no = ?', params.no)

def add(paramsArr):
    newNo = 'BUY' + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    for params in paramsArr:
        params = toDict(params)
        buy = Buy(
            id=DBUtil.next_id(),
            no=newNo,
            provider_no=params.provider_no,
            provider_name=params.provider_name,
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
        buy.insert()

def update(buy):
    return buy.update()

def delete(buy):
    return buy.delete()
