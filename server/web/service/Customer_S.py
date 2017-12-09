# -*- coding=utf8
from server.db.Models import Customer
from server.db import DBUtil

def list(params):
    where = 'where no like ? and name like ? '
    pagestr = 'limit %s,%s' % (params.pageOffset, params.pageLimit)
    no = '%' + params.no + '%'
    name = '%' + params.name + '%'
    customers = Customer.find_by(where + pagestr, no, name)
    return customers

def listCount(params):
    where = 'where no like ? and name like ? '
    no = '%' + params.no + '%'
    name = '%' + params.name + '%'
    total = Customer.count_by(where, no, name)
    return total

def getById(params):
    return Customer.get(params.id)

def getByNo(params):
    return Customer.find_by('where no = ?', params.no)

def add(params):
    customer = Customer(
        id = DBUtil.next_id(),
        no = params.no,
        name = params.name,
        code = params.code,
        shuiwu = params.shuiwu,
        person = params.person,
        phone = params.phone,
        mobile = params.mobile,
        address = params.address,
        email = params.email,
        bank = params.bank,
        bank_no = params.bank_no,
        postcode = params.postcode,
        fax = params.fax,
        comment = params.comment,
        creater = params.creater,
        createtime = params.createtime
    )
    return customer.insert()

def update(customer):
    return customer.update()

def delete(customer):
    return customer.delete()
