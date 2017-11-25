import web


class index:
    def GET(self):
        return web.template.frender('index.html')()
