// pages/my/maintain/maintain-result/maintain-result.js
import { Config } from '../../../../utils/config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    navTitle: '提交成功',
    orderNumber: null,
    orderId: null,
    flag: null,
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderNumber = options.orderNumber;
    if (orderNumber) {
      this.setData({ orderNumber: orderNumber });
    }
    var orderId = options.orderId;
    if (orderId) {
      this.setData({ orderId: orderId });
    }
    // console.log(flag)
    var flag = options.flag;
    this.setData({ flag: flag })
    this.setResult();
  },
  /**
   * 结果初始化
   */
  setResult:function() {
    var flag = this.data.flag;
    switch (flag) {
      case '1':
        this.setData({
          navTitle: '支付结果',
          resultTitle: '支付成功',
          subTitle: '请前往填写快递物流单号吧~',
          cTitle: ''
        })
        break;
      case '2':
        this.setData({
          navTitle: '支付结果',
          resultTitle: '支付失败',
          subTitle: '返回查看订单详情~',
          cTitle: ''
        })
        break;
      case '3':
        this.setData({
          resultTitle: '订单提交成功',
          subTitle: '工艺师正在审核资料，请耐心等待~',
          cTitle: ''
        })
        break;
      case '4':
        this.setData({
          resultTitle: '提交成功',
          subTitle: '请耐心等待快递邮寄~',
          cTitle: '平台收到货后会第一时间通知您~'
        })
        break;
    }
  },
  /**
   * 去填写快递单号
   */
  goExpressNumber: function() {
    wx.redirectTo({
      url: '../mail/mail?orderId=' + this.data.orderId + '&orderNumber=' + this.data.orderNumber,
    })
  },
  /**
   * 首页
   */
  goHomeTap: function(){
    wx.switchTab({
      url: '../../../home/home',
    })
  },
  /**
   * 去查看订单
   */
  goMatOrderTap: function() {
    wx.redirectTo({
      url: '../detail-status/detail-status?orderId=' + this.data.orderId,
    })
  },
  /**
   * 重新支付
   */
  repaymentMatTap: function () {
    // console.log('重新支付')
    this.setData({ disabled: true });
    this.authorizePay(this.data.orderId);
  },
  // 获取支付授权
  authorizePay: function (orderId) {
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
              // console.log(res)
              if (res.data.code === '200') {
                var openid = res.data.data;
                that.wechatPayJsapi(orderId, openid, loginToken)
              } else {
                //获取 openid 异常
                //跳转到支付失败页面,有订单id可以在失败页面重新支付或者查看订单
                // var flag = 2;
                // wx.navigateTo({
                //   url: '../maintain-result/maintain-result?flag=' + flag + '&orderId=' + orderId,
                // })
                that.setData({
                  // isPaySuccess: false,
                  disabled: false
                })
              }
            }
          })
        } else {
          that.setData({
            disabled: false
          })
          // console.log("授权失败");
        }
      }
    })
  },
  // 请求支付参数并且去支付
  wechatPayJsapi: function (orderId, openid, loginToken) {
    var that = this;
    wx.request({
      url: Config.orderUrl + '/applets/pay/wechatpay/mat/jsapi',
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
        // console.log(res)
        if (res.data.code === '200') {
          var jsapiMap = res.data.data;
          that.wechatPay(orderId, jsapiMap);
        } else {
          //获取 openid 异常
          //跳转到支付失败页面
          // console.log('dddddd')
          // var flag = 2;
          // wx.navigateTo({
          //   url: '../maintain-result/maintain-result?flag=' + flag + '&orderId=' + orderId,
          // })
          that.setData({
            // isPaySuccess: false,
            disabled: false
          })
        }
      }
    })
  },
  wechatPay: function (orderId, jsapiMap) {
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
        // var flag = 1;
        // wx.redirectTo({
        //   url: '../maintain-result/maintain-result?flag=' + flag + '&orderNumber=' + that.data.orderNumber,
        // })
        that.setData({
          // isPaySuccess: true,
          navTitle: '支付结果',
          resultTitle: '支付成功',
          subTitle: '请前往填写快递物流单号吧~',
          cTitle: '',
          disabled: false
        })
      },
      'fail': function (res) {
        // console.log('fail:' + JSON.stringify(res));
        // var flag = 2;
        // wx.redirectTo({
        //   url: '../maintain-result/maintain-result?flag=' + flag + '&orderId=' + orderId,
        // })
        that.setData({
          // isPaySuccess: false,
          disabled: false
        })
      }
    })
  },

  // 刷新订单状态
  orderStatus: function (orderId) {
    wx.request({
      url: Config.orderUrl + '/pay/wechat/order/mat/query?orderId=' + orderId,
      method: 'GET',
      success: function (res) {
        // console.log(res)
        // callback && callback(res)
      }
    })
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