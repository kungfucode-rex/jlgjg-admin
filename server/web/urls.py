from controller.User_C import *
from controller.Index_C import *
from controller.Provider_C import *
from controller.Customer_C import *
from controller.Goods_C import *
from controller.Taizhang_C import *

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
    '/user/edit', 'edit_user',
    
    '/provider/list', 'list_provider',
    '/provider/add', 'add_provider',
    '/provider/delete', 'delete_provider',
    '/provider/edit', 'edit_provider',
    '/provider/byId', 'get_provider_by_id',

    '/customer/list', 'list_customer',
    '/customer/add', 'add_customer',
    '/customer/delete', 'delete_customer',
    '/customer/edit', 'edit_customer',
    '/customer/byId', 'get_customer_by_id',

    '/goods/list', 'list_goods',
    '/goods/add', 'add_goods',
    '/goods/delete', 'delete_goods',
    '/goods/edit', 'edit_goods',
    '/goods/byId', 'get_goods_by_id',

    '/taizhang/list', 'list_taizhang',
    '/taizhang/add', 'add_taizhang',
    '/taizhang/delete', 'delete_taizhang',
    '/taizhang/edit', 'edit_taizhang',
    '/taizhang/byId', 'get_taizhang_by_id'
)