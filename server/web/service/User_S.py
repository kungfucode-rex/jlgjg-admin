from server.db.Models import User
import json

def listUser(params):
    users = User.find_by('limit %s,%s' % (params.offset, params.limit))
    return json.dumps(users)
