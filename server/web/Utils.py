# -*- coding=utf8
import json
from conf.config import configs
import web, time, hashlib
from server.db.Models import User

_COOKIE_KEY = configs.session.secret

class Dict(dict):
    def __init__(self, name=(), values=(), **kw):
        super(Dict, self).__init__(**kw)
        for k, v in zip(name, values):
            self[k] = v

    def __getattr__(self, key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError('没找到属性 %s' % key)

def toDict(d):
    D = Dict()
    for k, v in d.iteritems():
        D[k] = toDict(v) if isinstance(v, dict) else v
    return D

def merge(defaults, override):
    r = {}
    for k, v in defaults.iteritems():
        if k in override:
            if isinstance(v, dict):
                r[k] = merge(v, override[k])
            else:
                r[k] = override[k]
        else:
            r[k] = v
    return r

def OK_Result(msg='操作成功', data=[]):
    result = {
        'code': 200,
        'msg': msg,
        'data': data
    }
    return json.dumps(result)


def Error_Result(msg='操作失败', data=[]):
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
