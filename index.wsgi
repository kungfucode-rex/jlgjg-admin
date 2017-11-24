import sae.const
import _mysql
import web
urls = ('/hello', 'hello')
app = web.application(urls, globals()).wsgifunc()
class hello:
    def GET(self):
        web.header('Content-Type', 'text/plain')
        return 'helloss'
    
def app1(environ, start_response):
    start_response('200 ok', [('content-type', 'text/plain')])
    db=_mysql.connect(sae.const.MYSQL_HOST,sae.const.MYSQL_USER,sae.const.MYSQL_PASS,sae.const.MYSQL_DB)
    db.query('select * from taizhang')
    r = db.store_result()

    return str(dir(web))
application = sae.create_wsgi_app(app)