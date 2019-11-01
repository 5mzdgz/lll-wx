import { Config } from '../../../utils/config.js';

const app = getApp();

class Address {
  constructor() {
    // super();
  }
  
  addressRequest(id, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v1/user/address/setting/def?id=' + id;

    wx.request({
      url: url,
      method: 'POST',
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

export { Address };