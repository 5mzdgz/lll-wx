import { Config } from '../../../../utils/config.js';

const app = getApp();

class Mail {
  constructor() {
    // super();
  }
  
  /**
   * 提交邮寄信息
   */
  postMailData(obj, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.orderUrl + '/l/v1/mat/order/shipping/address';
    wx.request({
      url: url,
      data: obj,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      method: 'POST',
      success: function (res) {
        // console.log(app.globalData.accessToken);
        callback && callback(res.data)
      }
    })
  }
}

export { Mail };