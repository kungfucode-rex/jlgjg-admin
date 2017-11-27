from server.db.Models import User
import json
from server.db import DBUtil


def list(params):
    where = "where name like ? and cnname like ? "
    pagestr = 'limit %s,%s' % (params.pageOffset, params.pageLimit)
    name = '%' + params.name + '%'
    cnname = '%' + params.cnname + '%'
    users = User.find_by(where + pagestr, name, cnname)
    return users

def listCount(params):
    where = "where name like ? and cnname like ? "
    name = '%' + params.name + '%'
    cnname = '%' + params.cnname + '%'
    total = User.count_by(where, name, cnname)
    return total


def getById(params):
    return json.dumps(User.get(params.id))


def add(params):
    user = User(
        id=DBUtil.next_id(),
        name=params.name,
        cnname=params.cnname,
        password=params.password)
    return user.insert()
