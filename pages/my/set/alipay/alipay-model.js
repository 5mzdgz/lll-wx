import { Config } from '../../../../utils/config.js';

const app = getApp();

class Alipay {
  constructor() {
    // super();
  }

  formData(obj, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v1/user/withdraw/info/setting';

    wx.request({
      url: url,
      method: 'POST',
      data: obj,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res)
      }
    })
  };

  verificationCode(obj, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v1/user/vcode';

    wx.request({
      url: url,
      method: 'POST',
      data: obj,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res)
      }
    })
  };

}

export { Alipay };