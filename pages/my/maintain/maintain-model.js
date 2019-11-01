import { Config } from '../../../utils/config.js';

const app = getApp();

class Maintain {
  constructor() {
    // super();
  }


  //获取数据
  maintainArr(callback) {
    var url = Config.productUrl + '/l/v1/mat/search';
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data.data)
      }
    })
  };

  // 生成订单
  postMaintain(maintainData, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.orderUrl + '/l/v1/mat/order/confirm';

    wx.request({
      url: url,
      method: 'POST',
      data: maintainData,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(app.globalData.accessToken)
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data)
      }
    })
  };

}

export { Maintain };