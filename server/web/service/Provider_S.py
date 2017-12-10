# -*- coding=utf8
from server.db.Models import Provider
from server.db import DBUtil
import time

def list(params):
    where = "where no like ? and name like ?  order by no "
    pagestr = 'limit %s,%s' % (params.pageOffset, params.pageLimit)
    no = '%' + params.no + '%'
    name = '%' + params.name + '%'
    providers = Provider.find_by(where + pagestr, no, name)
    return providers

def listCount(params):
    where = "where no like ? and name like ? "
    no = '%' + params.no + '%'
    name = '%' + params.name + '%'
    total = Provider.count_by(where, no, name)
    return total

def getById(params):
    return Provider.get(params.id)

def getByNo(params):
    return Provider.find_by('where no = ?', params.no)

def blurQueryByName(params):
    name = '%' + params.name + '%'
    return Provider.find_by('where name like ?', name)

def add(params):
    provider = Provider(
        id=DBUtil.next_id(),
        no=getNewNo(),
        name = params.name,
        code = params.code,
        shuiwu = params.shuiwu,
        person = params.person,
        phone = params.phone,
        mobile = params.mobile,
        address = params.address,
        email = params.email,
        url = params.url,
        postcode = params.postcode,
        fax = params.fax,
        comment = params.comment,
        creater = params.creater,
        createtime = int(time.time() * 1000),
    )
    return provider.insert()

def update(provider):
    return provider.update()

def delete(provider):
    return provider.delete()

def getNewNo():
    sql = 'select max(no) from provider'
    results = DBUtil.select(sql)
    maxNo = results[0]['max(no)']
    if maxNo != '':
        newNo = 'G' + str(int(maxNo.replace('G', '1')) + 1)[1:]
        return newNo
    else:
        # 没有记录，新创建一个
        return 'G00001'
