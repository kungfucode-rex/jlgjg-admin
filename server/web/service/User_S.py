from server.db.Models import User

def listUser(params):
    return User.find_by('limit %s,%s' % (params.offset, params.limit))