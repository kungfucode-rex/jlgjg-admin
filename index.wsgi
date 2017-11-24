# -*- coding:utf8
import sae.const
import DBUtil
from Models import User
import web
web.config.debug = True
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

config = {
    'db': {
        'host': sae.const.MYSQL_HOST,
        'port': 3306,
        'db': sae.const.MYSQL_DB,
        'user': sae.const.MYSQL_USER,
        'passwd': sae.const.MYSQL_PASS
    }
}
config = toDict(config)
DBUtil.create_engine(**config.db)
urls = ('/hello', 'hello')
app = web.application(urls, globals())
app.debug = True
class hello:
    def GET(self):
        web.header('Content-Type', 'text/plain')
        return str(DBUtil.select_one('select * from taizhang'))
    
if __name__ == '__main__':
    app.run
else:
	application = sae.create_wsgi_app(app)    
    
def app1(environ, start_response):
    start_response('200 ok', [('content-type', 'text/plain')])
    db=_mysql.connect(sae.const.MYSQL_HOST,sae.const.MYSQL_USER,sae.const.MYSQL_PASS,sae.const.MYSQL_DB)
    db.query('select * from taizhang')
    r = db.store_result()

    return str(dir(web))
