import { Config } from '../../../../utils/config.js';

const app = getApp();

class Cash {
  constructor() {
    // super();
  }

  cashData(callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v1/user/withdraw/list';

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data.data)
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

  cashConfrim(obj, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v1/user/withdraw/request';

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
        // console.log(app.globalData.accessToken)
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res)
      }
    })
  };

}

export { Cash };