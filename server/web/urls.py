from controller.User_C import *
from controller.Index_C import *

urls = (
    '/index', 'index',
    '/getValidateCode', 'get_validate_code',
    '/login', 'login',
    "/user/list", "list_user",
    '/user', 'get_user_by_id',
    '/user/add', 'add_user'
)