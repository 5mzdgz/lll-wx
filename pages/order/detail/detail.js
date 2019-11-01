// pages/order/detail/detail.js
import { Detail } from 'detail-model.js';
import { Order } from '../../order/order-model.js';
import { Alipay } from '../../my/set/alipay/alipay-model.js';
import { Pay } from '../../pay/pay-model.js';
var alipay = new Alipay();
var detail = new Detail();
var pay = new Pay();
var order = new Order();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    isShow: false,
    shortDisabled: false,
    payFocus: false,
    codename: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId;
    // console.log(orderId);
    this.setData({
      orderId: orderId
    })
    this.getOrderArr(this.data.orderId);
    this.setPhone();
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    
  },

  // 通过orderid获取数据
  getOrderArr: function (orderId) {
    var that = this;
    detail.getOrderDetailData(orderId, (resData)=>{
      // console.log(resData)
      if (resData.shippingMethods){
        var shippingArr = app.globalData.shippingMethods;
        for (var i = 0; i < shippingArr.length; i++) {
          if (resData.shippingMethods === shippingArr[i].id){
            resData.shippingName = shippingArr[i].shippingName;
            // resData.shippingUrl = shippingArr[i].shippingUrl + resData.shippingCode;
          }
        }
      }

      this.setData({
        orderData: resData,
        productList: resData.productList,
      })
      // console.log(this.data.orderData);
      this.countDown();
    })
  },

  countDown: function () {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    var newTime = new Date().getTime();
    var orderData = this.data.orderData;
    // console.log(orderData);

    // var endTime = Date.parse(new Date(orderData.createTime)) + 1 * 60 * 60 * 1000;// 结束时间
    var endTime = new Date(orderData.createTime.replace(/\-/g, '/')).getTime() + 1 * 60 * 60 * 1000;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        var time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      
        var minTime = this.getzf(min),
          secTime = this.getzf(sec);
        // 渲染，然后每隔一秒执行一次倒计时函数
        this.setData({
          min: minTime,
          sec: secTime
        })
      } else {
        // 渲染，然后每隔一秒执行一次倒计时函数
        this.setData({
          min: '00',
          sec: '00'
        })
      }
     
    setTimeout(this.countDown, 1000);
  },

  //补0操作  
  getzf: function (num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  
  // 查看物流
  seeShippingTap:function(e) {
    // console.log(e.currentTarget.dataset.text);
    var shippingUrl = encodeURIComponent(e.currentTarget.dataset.text);
    wx.navigateTo({
      url: '../../order/out/out?shippingUrl=' + shippingUrl,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 自动取消倒计时
  arrivalTime: function () {
   
  },

  // 复制物流单号
  copyText: function (e) {
    // console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  
  // 取消订单
  cancelTap: function () {
    var that = this;
    var orderId = this.data.orderId;
    wx.showModal({
      // title: '取消订单',
      content: '取消订单',
      showCancel: true,
      cancelText: "否",
      cancelColor: '#777',
      confirmText: "是",//
      confirmColor: '#E72C2C',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          // 点击确定
          order.cancelData(orderId, (res) => {
            // console.log(res)
            if (res.code === '200') {
              wx.redirectTo({
                url: '../../order/order?index=0',
              })
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 关闭支付
   */
  closeTap: function () {
    this.setData({
      isShow: false,
      payFocus: false
    })
  },
  // 继续支付
  continuePayTap:function() {
    var orderData = this.data.orderData;
    if (orderData.paymentMethod === 1) {
      detail.authorizePay(this.data.orderId);
    } else if (orderData.paymentMethod === 3) {
      this.setData({
        total: orderData.total,
        orderId: orderData.id,
        isShow: true,
        payFocus: true
      })
    }
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
        var flag = 1;
        wx.redirectTo({
          url: '../../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + this.data.orderId,
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
        var flag = 2;
        var payMethodId = 3;
        wx.redirectTo({
          url: '../../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + this.data.orderId + '&payMethodId=' + payMethodId + '&total=' + this.data.total,
        })
      }
    });
  },
  /**
   * 格式化手机号
   */
  setPhone: function () {
    // var phone = app.globalData.phone;
    var phone = wx.getStorageSync('phone');
    // console.log(phone)
    var str = phone.substr(0, 3) + "****" + phone.substr(7);
    this.setData({
      sPhone: str
    })
  },
  // 申请售后
  aftermarketTap:function() {
    // wx.navigateTo({
    //   url: '../../order/aftermarket/aftermarket?order=' + this.data.orderId,
    // })
  },

  // 联系客服
  handleContact(e) {
    // console.log(e.path)
    // console.log(e.query)
  },

  // 确认收货
  confrimTap: function (e) {
    var index = 4;
    var that = this;
    var orderId = this.data.orderId;
    // console.log(orderId)
    wx.showModal({
      title: '确认收货',
      content: '请确认是否已经收到货？',
      showCancel: true,
      cancelText: "否",
      cancelColor: '#777',
      confirmText: "是",//
      confirmColor: '#E72C2C',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          // 点击确定
          order.confrimData(orderId, (res) => {
            // console.log(res)
            if (res.code === '200') {
              wx.redirectTo({
                url: '../../order/order?index=' + index,
              })
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 申请退款
  refundTap: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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