const baseUrl = 'http://192.168.1.2:8080/';
/**
 * 封装基础请求函数
 */
const baseRequest = function (config, callback) {
  config.url = baseUrl+config.url;
  let requestData = {
    method:"GET",
    header:{
      'content-type': 'application/json'
    },
    success: function(res) {
      return callback(res);
    }
  };
  for(var k in config){
    if (k == 'header') {
      for(var j in config[k]){
        requestData[k][j] = config[k][j];
      }
    }else{
      requestData[k] = config[k];
    }
  }
  wx.request(requestData);
};


module.exports = {
  baseRequest:baseRequest,
}
