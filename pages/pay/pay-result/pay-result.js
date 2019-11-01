import { Config } from '../../../utils/config.js';
import { Alipay } from '../../my/set/alipay/alipay-model.js';
import { Pay } from '../../pay/pay-model.js';
var alipay = new Alipay();
var pay = new Pay();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    isPaySuccess: false,
    disabled: false,
    isShow: false,
    shortDisabled: false,
    payFocus: false,
    payMethodId: null,
    codename: '获取验证码',
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 支付状态
    var flag = options.flag;
    // console.log(flag)
    // 支付生成的订单id
    var orderId = options.orderId;
    // 支付方式
    if (options.payMethodId && options.total) {
      var payMethodId = options.payMethodId;
      var total = options.total;
      this.setData({
        payMethodId: payMethodId,
        total: total
      })
    }
    // console.log(this.data.payMethodId);
    this.setData({
      orderId: orderId,
      flag: flag,
    });
    if(this.data.flag==1) {
      // console.log('...')
      this.setData({
        isPaySuccess: true
      })
    } else if (this.data.flag == 2) {
      // console.log('...')
      this.setData({
        isPaySuccess: false
      })
    }
    this.setPhone();
  },
  // 查看订单
  seeOrderTap: function(){
    wx.redirectTo({
      url: '../../order/detail/detail?orderId=' + this.data.orderId,
    })
  },

  // 支付成功，调回首页
  homeTap:function() {
    wx.switchTab({
      url: '../../home/home',
    })
  },

  // 重新支付
  repaymentTap:function() {
    this.setData({
      disabled: true
    })
    if (this.data.payMethodId == 3) {
      this.setData({
        isShow: true,
        payFocus: true
      })
    } else {
      this.authorizePay(this.data.orderId);
    }
  },
  /**
   * 隐藏密码框
   */
  closeHiddanTap: function() {
    this.setData({
      isShow: false,
      payFocus: false,
      disabled: false
    })
  },

  /**
   * 获取验证码
   */
  getVerificationCode: function () {
    var that = this;
    var obj = {
      type: 4,
      phone: app.globalData.phone
    };
    // var obj1 = encodeURIComponent(obj);
    // console.log(obj)
    alipay.verificationCode(obj, (res) => {
      // console.log(res)
      that.setData({
        shortDisabled: true
      })
      var num = 61;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          that.setData({
            codename: '重新发送',
            shortDisabled: false
          })

        } else {
          that.setData({
            codename: num + "s"
          })
        }
      }, 1000)
    })
  },
  /**
   * 支付确认
   */
  formSubmit: function (e) {
    var obj = {
      orderId: this.data.orderId,
      payPassword: e.detail.value.payPassword,
      mobileCode: e.detail.value.code,
      source: 'applets'
    }
    // console.log(obj)
    pay.walletPay(obj, (res) => {
      // console.log(res)
      if (res.code === '803') {
        this.setData({
          isPaySuccess: true,
          disabled: false,
          isShow: false,
          payFocus: false
        })
      } else if (res.code === '806') {
        this.setData({
          disabled: false
        })
        var that = this;
        wx.showModal({
          // title: '支付密码错误，请重试',
          content: '支付密码错误，请重试',
          showCancel: true,
          cancelText: "忘记密码",
          cancelColor: '#1E1E1E',
          confirmText: "重试",//
          confirmColor: '#E72C2C',
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
              wx.navigateTo({
                url: '../../my/set/reset-password/reset-password',
              })
            } else {
              // 点击确定
              that.setData({
                isShow: true,
                payFocus: true
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else if (res.code == '203') {
        wx.showToast({
          title: '验证码无效',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          isPaySuccess: false,
          disabled: false
        })
      }
    });
  },
  /**
   * 格式化手机号
   */
  setPhone: function () {
    var phone = wx.getStorageSync('phone');
    var str = phone.substr(0, 3) + "****" + phone.substr(7);
    this.setData({
      sPhone: str
    })
  },

  // 获取支付授权
  authorizePay:function(orderId) {
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
                // var flag = 2;
                // wx.navigateTo({
                //   url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
                // })
                that.setData({
                  isPaySuccess: false,
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
  wechatPayJsapi:function(orderId, openid, loginToken) {
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
          // var flag = 2;
          // wx.navigateTo({
          //   url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
          // })
          that.setData({
            isPaySuccess: false,
            disabled: false
          })
        }
      }
    })
  },
  wechatPay:function(orderId, jsapiMap) {
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
        //   url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
        // })
        that.setData({
          isPaySuccess: true,
          disabled: false
        })
      },
      'fail': function (res) {
        // console.log('fail:' + JSON.stringify(res));
        // var flag = 2;
        // wx.redirectTo({
        //   url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + orderId,
        // })
        that.setData({
          isPaySuccess: false,
          disabled: false
        })
      }
    })
  },

  // 刷新订单状态
  orderStatus:function(orderId) {
    wx.request({
      url: Config.orderUrl + '/pay/wechat/order/query?orderId=' + orderId,
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

  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/home/home',
      // imageUrl: '/image/common/logo@2x.png'
    }
  }
})