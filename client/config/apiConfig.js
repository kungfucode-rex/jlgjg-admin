module.exports = function (env) {
  // 本地环境
  let server = 'http://localhost:8080';

  if (env === 'production') {
    // 生产环境
    server = 'http://jlgjg.applinzi.com';
  }

  return {
    // index
    apiUptokenUrl: JSON.stringify(server + '/getUptoken'),
    apiUpDomain: JSON.stringify(server + '/getUpdomain'),
    apiGetUser: JSON.stringify(server + '/getUser'),
    apiLogin: JSON.stringify(server + '/login'),
    apiGetValidateCode: JSON.stringify(server + '/getValidateCode'),
    apiLogout: JSON.stringify(server + '/loginOut'),
    // User
    apiUserList: JSON.stringify(server + '/user/list'),
    apiUserAdd: JSON.stringify(server + '/user/add'),
    apiUserEdit: JSON.stringify(server + '/user/edit'),
    apiUserById: JSON.stringify(server + '/user/byId'),
    apiUserDelete: JSON.stringify(server + '/user/delete'),
    apiChangePwd: JSON.stringify(server + '/user/pwd'),
    apiIsAvailabeUserName: JSON.stringify(server + '/user/isAvailableUserName'),
    // Provider
    apiProviderList: JSON.stringify(server + '/provider/list'),
    apiProviderAdd: JSON.stringify(server + '/provider/add'),
    apiProviderEdit: JSON.stringify(server + '/provider/edit'),
    apiProviderById: JSON.stringify(server + '/provider/byId'),
    apiProviderDelete: JSON.stringify(server + '/provider/delete'),
    apiProviderByName: JSON.stringify(server + '/provider/byName'),
    // Customer
    apiCustomerList: JSON.stringify(server + '/customer/list'),
    apiCustomerAdd: JSON.stringify(server + '/customer/add'),
    apiCustomerEdit: JSON.stringify(server + '/customer/edit'),
    apiCustomerById: JSON.stringify(server + '/customer/byId'),
    apiCustomerDelete: JSON.stringify(server + '/customer/delete'),
    // Goods
    apiGoodsList: JSON.stringify(server + '/goods/list'),
    apiGoodsAdd: JSON.stringify(server + '/goods/add'),
    apiGoodsEdit: JSON.stringify(server + '/goods/edit'),
    apiGoodsById: JSON.stringify(server + '/goods/byId'),
    apiGoodsDelete: JSON.stringify(server + '/goods/delete'),
    apiGoodsByName: JSON.stringify(server + '/goods/byName'),
    // Buy
    apiBuyList: JSON.stringify(server + '/buy/list'),
    apiBuyAdd: JSON.stringify(server + '/buy/add')
  }
};
