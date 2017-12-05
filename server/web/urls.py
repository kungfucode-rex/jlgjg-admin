from controller.User_C import *
from controller.Index_C import *

urls = (
    '/index', 'index',
    '/getValidateCode', 'get_validate_code',
    '/login', 'login',
    '/getUser', 'get_user',
    '/loginOut', 'login_out',

    "/user/list", "list_user",
    "/user/isAvailableUserName", "is_available_name",
    '/user/byId', 'get_user_by_id',
    '/user/pwd', 'change_pwd',
    '/user/add', 'add_user',
    '/user/delete', 'delete_user',
    '/user/edit', 'edit_user'
)