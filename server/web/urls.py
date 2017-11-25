from controller.User_C import *
from controller.Index_C import *

urls = (
    '/index', 'index',
    "/user/list", "list_user",
    '/user', 'get_user_by_id',
    '/user/add', 'add_user',
    '/authenticate', 'authenticate'
)