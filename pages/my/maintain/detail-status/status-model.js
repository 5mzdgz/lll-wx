import { Config } from '../../../../utils/config.js';

const app = getApp();

class Status {
  constructor() {
    // super();
  }


  //获取订单详情数据
  statusData(orderId, callback) {
    var oUrl = Config.orderUrl + '/l/v1/user/mat/order/dtl?orderId=' + orderId;
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: oUrl,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
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
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data)
      }
    })
  };

}

export { Status };