import json
from conf.config import configs
import web, time, hashlib
from server.db.Models import User

_COOKIE_KEY = configs.session.secret


def OK_Result(msg, data=[]):
    result = {
        'code': 200,
        'msg': msg,
        'data': data
    }
    return json.dumps(result)


def Error_Result(msg, data=[]):
    result = {
        'code': 400,
        'msg': msg,
        'data': data
    }
    return json.dumps(result)


def get_user_by_cookie(cookie_str):
    try:
        L = cookie_str.split('-')
        if len(L) != 3:
            return None
        id, expires, md5 = L
        if int(expires) < time.time():
            return None
        user = User.get(id)
        if user is None:
            return None
        if md5 != hashlib.md5('%s-%s-%s-%s' % (id, user.password, expires, _COOKIE_KEY)).hexdigest():
            return None
        return user
    except:
        return None
