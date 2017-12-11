# -*- coding=utf8
from server.db.Models import Buy
from server.db.Models import Goods
from server.db.Models import Taizhang
from server.db.DBUtil import *
import datetime, time
from server.web.Utils import *
from server.web.service import Goods_S
from server.web.service import Taizhang_S

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

@with_transaction
def add(paramsArr):
    try:
        newNo = 'BUY' + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        for params in paramsArr:
            params = toDict(params)
            tempTime = int(time.time() * 1000)
            goods = Goods_S.getByNo(toDict({'no': params.goods_no}))
            beforeAprice = goods.aprice
            # 更新库存
            goods.quantity = goods.quantity + float(params.quantity)
            goods.money = goods.money + float(params.money)
            goods.aprice = goods.money / goods.quantity
            afterAprice = goods.aprice
            buy = Buy(
                id=next_id(),
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
                buy_quantity = params.quantity,
                buy_price = params.price,
                buy_money = params.money,
                store_quantity = goods.quantity,
                store_money = goods.money,
                store_aprice = goods.aprice,
                comment = params.comment
            )
            taizhang.insert()
            goods.update()
            buy.insert()
    except:
        print '购买失败'

def update(buy):
    return buy.update()

def delete(buy):
    return buy.delete()
