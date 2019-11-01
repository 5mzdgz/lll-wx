import { Config } from '../../../../utils/config.js';

const app = getApp();

class MatOrder {
  constructor() {
    // super();
  }


  //获取订单数据
  orderData(currentTab, page, size, flag, callback) {
    // console.log(currentTab)
    if (flag == '1') {
      if (currentTab == 0) {
        var oUrl = Config.orderUrl + '/l/v1/user/mat/order/list?orderStatus=0' + '&page=' + page + '&size=' + size;
      } else if (currentTab > 0) {
        var checkStatus = currentTab - 1;
        var oUrl = Config.orderUrl + '/l/v1/user/mat/order/list?checkStatus=' + checkStatus + '&orderStatus=0' + '&page=' + page + '&size=' + size;
      }
    } else {
      if (currentTab == 0) {
        var oUrl = Config.orderUrl + '/l/v1/user/mat/order/list?checkStatus=1&page=' + page + '&size=' + size;
      } else if (currentTab > 0) {
        var oUrl = Config.orderUrl + '/l/v1/user/mat/order/list?orderStatus=' + currentTab + '&checkStatus=1' + '&page=' + page + '&size=' + size;
      }
    }
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

  // 确认收货
  confrimData(orderId, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.orderUrl + '/l/v1/user/mat/order/confirm?orderId=' + orderId,
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

}

export { MatOrder };