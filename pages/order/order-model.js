import { Config } from '../../utils/config.js';

const app = getApp();

class Order {
  constructor() {
    // super();
  }
  //获取用户订单信息
  getOrderData(currentTab, page, size, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    // console.log(app.globalData.accessToken);
    var oUrl;
    if (currentTab == 0) {
      var oUrl = Config.orderUrl + '/l/v1/user/order/list?page=' + page + '&size=' + size;
    } else if (currentTab > 0) {
      var status = currentTab - 1;
      var oUrl = Config.orderUrl + '/l/v1/user/order/list?status=' + status + '&page=' + page + '&size=' + size;
    }
    // console.log(oUrl);
    wx.request({
      url: oUrl,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        if(res.data.code === "200"){
          callback && callback(res.data.data)
        }
      }
    })
  };

  // 取消订单
  cancelData(orderId,callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.orderUrl + '/l/v1/user/order/cancel?orderId=' + orderId,
      method: 'POST',
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
  }

  // 确认收货
  confrimData(orderId, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.orderUrl + '/l/v1/user/order/confirm?orderId=' + orderId,
      method: 'POST',
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
  }
  
};

export { Order };