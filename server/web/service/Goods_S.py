# -*- coding=utf8
from server.db.Models import Goods
from server.db import DBUtil

def list(params):
    where = "where no like ? and name like ? "
    pagestr = 'limit %s,%s' % (params.pageOffset, params.pageLimit)
    no = '%' + params.no + '%'
    name = '%' + params.name + '%'
    goodss = Goods.find_by(where + pagestr, no, name)
    return goodss

def listCount(params):
    where = "where no like ? and name like ? "
    no = '%' + params.no + '%'
    name = '%' + params.name + '%'
    total = Goods.count_by(where, no, name)
    return total

def getById(params):
    return Goods.get(params.id)

def blurQueryByName(params):
    name = '%' + params.name + '%'
    return Goods.find_by('where name like ?', name)

def getByNo(params):
    return Goods.find_by('where no = ?', params.no)

def add(params):
    goods = Goods(
        id=DBUtil.next_id(),
        no= getNewNo(),
        name = params.name,
        guige = params.guige,
        unit = params.unit,
        conversion = params.conversion,
        quantity = params.quantity,
        aprice = params.aprice
    )
    return goods.insert()

def update(goods):
    return goods.update()

def delete(goods):
    return goods.delete()

def getNewNo():
    sql = 'select max(no) from goods'
    results = DBUtil.select(sql)
    maxNo = results[0]['max(no)']
    if maxNo != '':
        newNo = 'S' + str(int(maxNo.replace('S', '1')) + 1)[1:]
        return newNo
    else:
        # 没有记录，新创建一个
        return 'S0001'