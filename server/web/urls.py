from server.db.Models import User

class list_user:
    def GET(self):
        return User.find_all()

urls = (
    "/user/list", "list_user"
)