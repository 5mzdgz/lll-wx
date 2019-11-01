// pages/order/order.js
import { Order } from 'order-model.js';
import { Pay } from '../pay/pay-model.js';
import { Alipay } from '../my/set/alipay/alipay-model.js';
var alipay = new Alipay();
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
    orderId: null,
    codename: '获取验证码',
    navbar: ['全部', '待支付', '待发货', '待收货', '已完成'],
    currentTab: 0,
    index: 0,
    page: 1,
    size: 10,
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options.index);
    // 接收个人中心页传过来的订单状态下标
    this.setData({
      currentTab: options.index,
      page: 1
    })
    this.getOrderArr(this.data.currentTab, this.data.page, this.data.size);
    this.setPhone();
  },

  // 顶部tab切换
  navbarTap: function (e) {
    var index = e.currentTarget.dataset.index
    var page = 1;
    this.setData({
      currentTab: index
    })
    this.getOrderArr(this.data.currentTab, page, this.data.size);
  },

  // 获取全都订单信息
  getOrderArr: function (currentTab, page, size, callback) {
    order.getOrderData(currentTab, page, size, (resData) => {
      // console.log(resData);
      if (page > 1) {
        var orderArr = this.data.orderArr;
        if (resData.length > 0) {
          for (var i = 0; i < resData.length; i++) {
            var number = 0;
            for (var j = 0; j < resData[i].productList.length; j++) {
              // 商品数量
              number += resData[i].productList[j].commodityNum;
            }
            resData[i].number = number;
            resData.forEach((item) => {
              orderArr.push(item);
            })
          }
        } 
      } else {
        if (resData.length > 0) {
          for (var i = 0; i < resData.length; i++) {
            var number = 0;
            for (var j = 0; j < resData[i].productList.length; j++) {
              // var productList = resData[i].productList
              // 商品数量
              number += resData[i].productList[j].commodityNum;
            }
            resData[i].number = number;
          }
        }
        var orderArr = resData;
      }
      // console.log(orderArr);
       // 隐藏加载框
      wx.hideLoading();
      this.setData({
        orderArr: orderArr,
        loadingHidden: true
      })
    });
  },
  //去支付
  goPayTap:function(e) {
    var orderItem = e.currentTarget.dataset.item;
    // console.log(orderItem)
    if (orderItem.paymentMethod === 1) {
      pay.authorizePay(orderItem.id);
    } else if (orderItem.paymentMethod === 3) {
      this.setData({
        total: orderItem.total,
        orderId: orderItem.id,
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
          url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + this.data.orderId,
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
                url: '../my/set/reset-password/reset-password',
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
          url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + this.data.orderId + '&payMethodId=' + payMethodId + '&total=' + this.data.total,
        })
      }
    });
  },
  /**
   * 关闭支付
   */
  closeTap: function() {
    this.setData({
      isShow: false,
      payFocus: false
    })
  },
  // 查看订单
  seeOrderTap:function(e) {
    // console.log('lll')
    var orderId = e.currentTarget.dataset.id;
    // console.log(orderId);
    wx.navigateTo({
      url: '../order/detail/detail?orderId=' + orderId,
    })
  },
  // 确认收货
  confrimTap:function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
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
            if (res.code === '200') {
              that.getOrderArr(that.data.currentTab, that.data.page, that.data.size);
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
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
  // 申请售后
  saleTap:function(e) {
    var orderId = e.currentTarget.dataset.id;
    
  },
  // 取消订单
  cancelTap:function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
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
              that.getOrderArr(that.data.currentTab, that.data.page, that.data.size);
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /* 下拉刷新 */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    // console.log('111')
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getOrderArr(this.data.currentTab, this.data.page, this.data.size,()=>{
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    });
    wx.stopPullDownRefresh();
  }, 

  // 上拉加载
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    this.setData({
      page: this.data.page + 1,
    })
    this.getOrderArr(this.data.currentTab, this.data.page, this.data.size);
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
    this.setData({
      page: 1
    })
    this.getOrderArr(this.data.currentTab, this.data.page, this.data.size);
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

  // 显示底部弹层
  showModal: function () {
    var _this = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
      showPop: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export()
      })
    }.bind(_this), 50)
  },

  // 隐藏底部弹层
  hideModal: function () {
    var _this = this;
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export(),
        showPop: false
      })
    }.bind(this), 200)
  },

  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/home/home',
      imageUrl: 'https://img.laoliangli.com/banner/banner-bedfeb9f34684f5ea19ebf15e7440b64.png'
    }
  }
})