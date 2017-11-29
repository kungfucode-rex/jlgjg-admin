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
    apiIsAvailabeUserName: JSON.stringify(server + '/user/isAvailableUserName')
  }
};
