module.exports = function (env) {
  // 本地环境
  let server = 'http://localhost:8080';

  if (env === 'production') {
    // 生产环境
    server = 'http://jlgjg.applinzi.com';
  }

  return {
    apiUptokenUrl: JSON.stringify(server + '/getUptoken'),
    apiUpDomain: JSON.stringify(server + '/getUpdomain'),
    apiGetUser: JSON.stringify(server + '/getUser'),
    apiLogin: JSON.stringify(server + '/login'),
    apiGetValidateCode: JSON.stringify(server + '/getValidateCode')
  }
};
