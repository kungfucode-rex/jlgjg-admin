import sae.const
import DBUtil
from Models import User
import web
config = {
    'db': {
        'host': sae.const.MYSQL_HOST,
        'port': 3306,
        'db': sae.const.MYSQL_DB,
        'user': sae.const.MYSQL_USER,
        'passwd': sae.const.MYSQL_PASS
    }
}
DBUtil.create_engine(**config.db)
urls = ('/hello', 'hello')
app = web.application(urls, globals())

class hello:
    def GET(self):
        web.header('Content-Type', 'text/plain')
        return 's'#User.get(1).cnname
    
if __name__ == '__main__':
    app.run
else:
	application = sae.create_wsgi_app(app.wsgifunc())    
    
def app1(environ, start_response):
    start_response('200 ok', [('content-type', 'text/plain')])
    db=_mysql.connect(sae.const.MYSQL_HOST,sae.const.MYSQL_USER,sae.const.MYSQL_PASS,sae.const.MYSQL_DB)
    db.query('select * from taizhang')
    r = db.store_result()

    return str(dir(web))
