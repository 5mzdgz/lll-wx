import { Config } from '../../utils/config.js';

const app = getApp();

class Pay {
  constructor() {
    // super();
  }

  // 获取用户钱包
  walletData(callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/wallet',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        callback && callback(res.data)
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  }
  // 用户钱包支付
  walletPay(obj, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.orderUrl + '/pay/wallet/walletpay',
      method: 'POST',
      data: obj,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        callback && callback(res.data)
        app.returnCode(res.data.code, res.data.msg);
      },
      fail: function () {
        var flag = 2;
        wx.redirectTo({
          url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + obj.orderId,
        })
      }
    })
  }
  // 获取用户默认地址
  getUserDefaultAddress(callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/address/get/def',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          callback(res.data.data)
        } 
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  }

  // 优惠卷
  getProductCoupon(item, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.orderUrl + '/coupon/v1/order/coupon/offer',
      method: 'POST',
      data: item,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          callback(res.data.data)
        } 
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  }

  // 获取支付授权
  authorizePay(orderId, loginToken, self){
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
                that.wechatPayJsapi(orderId, openid, loginToken, self)
              } else {
                //获取 openid 异常
                //跳转到支付失败页面,有订单id可以在失败页面重新支付或者查看订单
                var flag = 2;
                wx.navigateTo({
                  url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
                })
                self.setData({
                  disabled: false
                })
              }
            }
          })
        } else {
          // console.log("授权失败");
          self.setData({
            disabled: false
          })
        }
      }
    })
  }
  // 请求支付参数并且去支付
  wechatPayJsapi(orderId, openid, loginToken, self) {
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
          that.wechatPay(orderId, jsapiMap, self);
        } else {
          self.setData({
            disabled: false
          })
          //获取 openid 异常
          //跳转到支付失败页面
          var flag = 2;
          wx.navigateTo({
            url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
          })
        }
      }
    })
  }
  wechatPay(orderId, jsapiMap, self) {
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
          url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
        })
      },
      'fail': function (res) {
        // console.log('fail:' + JSON.stringify(res));
        self.setData({
          disabled: false
        })
        var flag = 2;
        wx.redirectTo({
          url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
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

}

export { Pay };