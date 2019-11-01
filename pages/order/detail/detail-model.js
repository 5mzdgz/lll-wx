import { Config } from '../../../utils/config.js';

const app = getApp();

class Detail {
  constructor() {
    // super();
  }
  //获取用户购物车信息
  getOrderDetailData(orderId, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    // console.log(app.globalData.accessToken);
    var dUrl = Config.orderUrl + '/l/v1/user/order/dtl?orderId=' + orderId;
    
    wx.request({
      url: dUrl,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        // console.log(res)
        callback && callback(res.data.data)
      }
    })
  };

  // 获取支付授权
  authorizePay(orderId, loginToken) {
    var loginToken = wx.getStorageSync('loginToken');
    var that = this;
    wx.login({
      success: function (e) {
        // console.log(e);
        //获取到授权的code
        if (e.code) {
          wx.request({
            url: Config.orderUrl + '/applets/pay/wechat/get/openid?code=' + e.code,
            method: 'GET',
            header: {
              'accessToken': app.globalData.accessToken,
              'loginToken': loginToken
            },
            success: function (res) {
              if (res.data.code === '200') {
                var openid = res.data.data;
                that.wechatPayJsapi(orderId, openid, loginToken)
              } else {
                //获取 openid 异常
                //跳转到支付失败页面,有订单id可以在失败页面重新支付或者查看订单
                var flag = 2;
                wx.navigateTo({
                  url: '../../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
                })
              }
            }
          })
        } else {
          // console.log("授权失败");
        }
      }
    })
  }
  // 请求支付参数并且去支付
  wechatPayJsapi(orderId, openid, loginToken) {
    var that = this;
    wx.request({
      url: Config.orderUrl + '/applets/pay/wechatpay/jsapi',
      method: 'GET',
      data: {
        "openId": openid,
        "state": orderId,
        "loginToken": loginToken
      },
      header: {
        'accessToken': app.globalData.accessToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          var jsapiMap = res.data.data;
          that.wechatPay(orderId, jsapiMap);
        } else {
          //获取 openid 异常
          //跳转到支付失败页面
          var flag = 2;
          wx.navigateTo({
            url: '../../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
          })
        }
      }
    })
  }
  wechatPay(orderId, jsapiMap) {
    var that = this;
    // console.log(jsapiMap);
    wx.requestPayment({
      'timeStamp': jsapiMap.timeStamp,
      'nonceStr': jsapiMap.nonceStr,
      'package': jsapiMap.package,
      'signType': jsapiMap.signType,
      'paySign': jsapiMap.paySign,
      'success': function (res) {
        that.orderStatus(orderId);
        // console.log(res);
        var flag = 1;
        wx.redirectTo({
          url: '../../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
        })
      },
      'fail': function (res) {
        // console.log('fail:' + JSON.stringify(res));
        var flag = 2;
        wx.redirectTo({
          url: '../../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
        })
      }
    })
  }

  // 刷新订单状态
  orderStatus(orderId, callback) {
    wx.request({
      url: Config.orderUrl + '/pay/wechat/order/query?orderId=' + orderId,
      method: 'GET',
      success: function (res) {
        // console.log(res)
        callback && callback(res)
      }
    })
  }

};

export { Detail };