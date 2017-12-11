# -*- coding=utf8
from server.db.Models import Taizhang
from server.db import DBUtil

def list(params):
    where = 'where no like ? '
    pagestr = 'limit %s,%s' % (params.pageOffset, params.pageLimit)
    no = '%' + params.no + '%'
    taizhangs = Taizhang.find_by(where + pagestr, no)
    return taizhangs

def listCount(params):
    where = 'where no like ? '
    no = '%' + params.no + '%'
    total = Taizhang.count_by(where, no)
    return total

def getById(params):
    return Taizhang.get(params.id)

def getByNo(params):
    return Taizhang.find_by('where no = ?', params.no)

def add(params):
    taizhang = Taizhang(
        id = DBUtil.next_id(),
        no = params.no,
        time = params.time,
        deal_no = params.deal_no,
        goods_no = params.goods_no,
        goods_name = params.goods_name,
        goods_guige = params.goods_guige,
        buy_quantity = params.buy_quantity,
        buy_price = params.buy_price,
        buy_money = params.buy_money,
        sale_quantity = params.sale_quantity,
        sale_price = params.sale_price,
        sale_money = params.sale_money,
        store_quantity = params.store_quantity,
        store_money = params.store_money,
        store_aprice = params.store_aprice,
        comment = params.comment
    )
    return taizhang.insert()

def update(taizhang):
    return taizhang.update()

def delete(taizhang):
    return taizhang.delete()

def getNewNo():
    sql = 'select max(no) from taizhang'
    results = DBUtil.select(sql)
    maxNo = results[0]['max(no)']
    if maxNo != None:
        newNo = 'T' + str(int(maxNo.replace('T', '1')) + 1)[1:]
        return newNo
    else:
        # 没有记录，新创建一个
        return 'T00001'
