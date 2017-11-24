from server.db.Models import User
import json
from server.db import DBUtil


def list(params):
    users = User.find_by('limit %s,%s' % (params.offset, params.limit))
    return json.dumps(users)


def getById(params):
    return json.dumps(User.get(params.id))


def add(params):
    user = User(
        id=DBUtil.next_id(),
        name=params.name,
        cnname=params.cnname,
        password=params.password)
    return user.insert()
