# -*- coding:utf8
from conf.config import configs
from server.db import DBUtil
from server.web.urls import *
import web, logging
from server.web.filter.AuthorizeFilter import loginFilter
logging.log_errors = '1'

web.config.debug = False
DBUtil.create_engine(**configs.db)

app = web.application(urls, globals())

session = web.session.Session(app, web.session.DiskStore('sessions'), initializer={'count': 0})
web.config._session = session
app.add_processor(loginFilter)

if __name__ == '__main__':
    print 'run'
    app.run()
else:
    try:
        import sae
        application = sae.create_wsgi_app(app.wsgifunc())
    except ImportError:
        print '没有 sae 模块'
