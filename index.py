# -*- coding:utf8
from conf.config import config
from server.db import DBUtil
from server.web.urls import *
import web

web.config.debug = True
DBUtil.create_engine(**config.db)
app = web.application(urls, globals())

if __name__ == '__main__':
    print 'run'
    app.run()
else:
    try:
        import sae
        application = sae.create_wsgi_app(app.wsgifunc())
    except ImportError:
        print '没有 sae 模块'
