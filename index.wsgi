import sae.const, sae
import _mysql, os
import api_config
def app(environ, start_response):
    start_response('200 ok', [('content-type', 'text/plain')])
    db=_mysql.connect(sae.const.MYSQL_HOST,sae.const.MYSQL_USER,sae.const.MYSQL_PASS,sae.const.MYSQL_DB)
    db.query('select * from taizhang')
    r = db.store_result()

    return str(dir(sae))
#application = WSGIApplication(os.path.dirname(os.path.abspath(__file__)))
application = sae.create_wsgi_app(app)
#application.add_module(api_config)