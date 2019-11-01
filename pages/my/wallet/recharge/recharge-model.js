import { Config } from '../../../../utils/config.js';

const app = getApp();

class Recharge {
  constructor() {
    // super();
  }

  // 获取支付授权
  authorizePay(consumAmount, loginToken) {
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
                that.wechatPayJsapi(consumAmount, openid, loginToken)
              } else {
                //获取 openid 异常
                wx.showToast({
                  title: '网络异常',
                  icon: 'none',
                  duration: 1000
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
  wechatPayJsapi(consumAmount, openid, loginToken) {
    var that = this;
    wx.request({
      url: Config.orderUrl + '/applets/pay/wechatpay/wallet',
      method: 'GET',
      data: {
        "openId": openid,
        "consumAmount": consumAmount,
        "loginToken": loginToken,
        "source": "applets"
      },
      header: {
        'accessToken': app.globalData.accessToken
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code === '200') {
          var jsapiMap = res.data.data;
          that.wechatPay(consumAmount, jsapiMap);
        } else {
          //获取 openid 异常
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  }
  wechatPay(consumAmount, jsapiMap) {
    var that = this;
    // console.log(jsapiMap);
    wx.requestPayment({
      'timeStamp': jsapiMap.timeStamp,
      'nonceStr': jsapiMap.nonceStr,
      'package': jsapiMap.package,
      'signType': jsapiMap.signType,
      'paySign': jsapiMap.paySign,
      'success': function (res) {
        that.rechargeStatus(jsapiMap.recordId);
        // console.log(res);
        wx.navigateTo({
          url: '../../set/set-result/set-result?flag=2' + '&consumAmount=' + consumAmount,
        })
      },
      'fail': function (res) {
        // console.log('fail:' + JSON.stringify(res));
       
      }
    })
  }

  // 刷新充值状态
  rechargeStatus(recordId, callback) {
    wx.request({
      url: Config.orderUrl + '/pay/wechat/wallet/query?recordId=' + recordId,
      method: 'GET',
      success: function (res) {
        // console.log(res)
        callback && callback(res)
      }
    })
  }

}

export { Recharge };