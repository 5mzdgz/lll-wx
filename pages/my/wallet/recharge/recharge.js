// pages/my/recharge/recharge.js
import { Config } from '../../../../utils/config.js';
import { Recharge } from 'recharge-model.js';
var recharge = new Recharge();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    money: '',
    focus: true,
    disabled: false,
    // payFocus: false,
    // passwordValue: '',
    // isShow: false
  },
  /**
   * 下一步，请求充值接口
   */
  bindFormSubmit: function (e) {
    // console.log(e.detail.value.money)
    if (!e.detail.value.money) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    // console.log(consumAmount)
    var spot = e.detail.value.money.split(".")[1];
    if (spot) {
      var len = spot.length
      if (len > 2) {
        wx.showToast({
          title: '请输入正确的金额',
          icon: 'none',
          duration: 1000
        })
        return false
      }
    }
    var consumAmount = parseFloat(e.detail.value.money);
    // console.log(consumAmount)
    if (consumAmount === 0) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    this.setData({
      disabled: true
    })
    // console.log(consumAmount)
    var loginToken = wx.getStorageSync('loginToken');
    // recharge.authorizePay(consumAmount, loginToken);
    this.authorizePay(consumAmount, loginToken);
  },
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
                that.setData({
                  disabled: false
                })
              }
            }
          })
        } else {
          // console.log("授权失败");
          that.setData({
            disabled: false
          })
        }
      }
    })
  },
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
          that.setData({
            disabled: false
          })
        }
      }
    })
  },
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
        that.setData({
          disabled: false
        })
      },
      'fail': function (res) {
        // console.log('fail:' + JSON.stringify(res));
        that.setData({
          disabled: false
        })
      }
    })
  },

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
  },
  /**
   * 隐藏输入密码
   */
  hiddanTap: function () {
    this.setData({
      isShow: false,
      passwordValue: '',
      payFocus: false
    })
  },
  /**
   * 下一步
   */
  rechargeTap: function () {
    this.setData({
      isShow: true,
      payFocus: true
    })
  },
  /**
   * 获取密码
   */
  passwordTap: function (e) {
    var password = e.detail.value
    // console.log(password)
    this.setData({
      passwordValue: password
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})