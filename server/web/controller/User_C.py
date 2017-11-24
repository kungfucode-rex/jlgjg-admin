from server.db.Models import User
from server.web.service import User_S
import web


class list_user:
    def GET(self):
        return User_S.listUser(web.input())
