// pages/my/maintain/maintain-order/maintain-order.js
import { Config } from '../../../../utils/config.js';
import { MatOrder } from 'matOrder-model.js'
var matOrder = new MatOrder();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    navTitle: '保养订单',
    navbar: ['全部','寄出中', '保养中', '寄回中', '已完成', '已拒收'],
    currentTab: 0,
    page: 1,
    size: 10,
    flag: null,
    orderNumber: null,
    disabled: false,
    isOpinion: false
  },

  /**
   * 切换状态
   */
  navbarTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var page = 1;
    this.setData({
      currentTab: index
    })
  
    this.getVerifyOrder(this.data.currentTab, page, this.data.size, this.data.flag);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = options.flag;
    if (flag == '1') {
      this.setData({
        navTitle: '审核订单',
        navbar: ['全部', '审核中', '审核通过', '未通过']
      })
    }
    this.setData({ flag: flag });
    // console.log(this.data.currentTab);
    // this.getVerifyOrder(this.data.currentTab, this.data.page, this.data.size, this.data.flag);
  },

  /**
   * 获取审核订单数据
   */
  getVerifyOrder: function (currentTab, page, size, flag) {
    matOrder.orderData(currentTab, page, size, flag, (resData) => {
      // console.log(resData);
      if (page > 1) {
        var checkedArr = this.data.checkedArr;
        if (resData.length > 0 && this.data.flag == '1') {
          resData.forEach((item) => {
            this.checkedStatus(item);
            checkedArr.push(item);
          })
        }
        if (resData.length > 0 && this.data.flag == '2') {
          resData.forEach((item,index) => {
            if (resData[index].orderStatus !== 0) {
              this.matOrderStatus(resData[index]);
              checkedArr.push(resData[index]);
            }
          })
        }
      } else {
        var checkedArr = [];
        if (resData.length > 0 && this.data.flag == '1') {
          resData.forEach((item) => {
            this.checkedStatus(item);
            checkedArr.push(item);
          })
        }
        if (resData.length > 0 && this.data.flag == '2') {
          resData.forEach((item,index) => {
            if (resData[index].orderStatus !== 0) {
              this.matOrderStatus(resData[index]);
              checkedArr.push(resData[index]);
            }
          })
        }
      }
      // 隐藏加载框
      wx.hideLoading();
      this.setData({
        checkedArr: checkedArr,
        loadingHidden: true
      })
    })
  },

  /**
   * 审核状态
   */
  checkedStatus:function(item) {
    if (item.checkStatus === 0) {
      if (!item.uploadImgs) {
        item.status = '审核中.待上传实物照片';
      } else {
        item.status = '审核中';
      }
    } else if (item.checkStatus === 1) {
      item.status = '待支付';
    } else if (item.checkStatus === 2) {
      item.status = '未通过';
    }

    var mcList = item.mcList;
    mcList.forEach((i) => {
      if (!i.price) {
        item.noTotal = '待评估'
      }
    }) 
  },
  /**
   * 全部状态
   */
  matOrderStatus: function(item) {
    if (item.orderStatus === 1) {
      item.status = '寄出中';
    } else if (item.orderStatus === 2) {
      item.status = '保养中';
    } else if (item.orderStatus === 3) {
      item.status = '寄回中';
    } else if (item.orderStatus === 4) {
      item.status = '已完成';
    } else if (item.orderStatus === 5) {
      item.status = '已拒收';
    } else if (item.orderStatus === 0 && item.checkStatus === 1) {
      item.status = '待支付';
    } else if (item.checkStatus === 2) {
      item.status = '未通过';
    } else if (item.checkStatus === 0) {
      if (!item.uploadImgs) {
        item.status = '审核中.待上传实物照片';
      } else {
        item.status = '审核中';
      }
    } 
  },
  /**
   * 意见反馈
   */
  goOpinionTap: function(e) {
    var item = e.currentTarget.dataset.item;
    // console.log(item)
    this.setData({
      orderNumber: item.orderNumber,
      isOpinion: true
    })
  },
  /**
   * 关闭意见反馈图层
   */
  closeOpinionTap: function() {
    this.setData({
      isOpinion: false
    })
  },
  /**
   * 立即领取
   */
  recoiveTap: function() {
    this.setData({ isOpinion: false });
    wx.navigateTo({
      url: '../maintain-opinion/maintain-opinion?orderNumber=' + this.data.orderNumber,
    })
  },
  /**
   * 上传照片
   */
  goUploadImgsTap: function(e) {
    var item = e.currentTarget.dataset.item;
    // console.log(item)
    wx.navigateTo({
      url: '../photograph/photograph?orderNumber=' + item.orderNumber + '&orderId=' + item.id,
    })
  },
  /**
   * 跳转详情页
   */
  orderDetailTap: function(e) {
    var orderId = e.currentTarget.dataset.id;
    // console.log(orderId);
    wx.navigateTo({
      url: '../detail-status/detail-status?orderId=' + orderId,
    })
  },

  /**
   * 确认收货
   */
  goConfrimTap: function(e) {
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
          matOrder.confrimData(orderId, (res) => {
            // console.log(res)
            if (res.code === '200') {
              that.getVerifyOrder(that.data.currentTab, that.data.page, that.data.size, that.data.flag);
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 去支付
   */
  checkPayTap: function(e) {
    var orderId = e.currentTarget.dataset.item.id;
    var orderNumber = e.currentTarget.dataset.item.orderNumber;
    this.setData({
      orderNumber: orderNumber,
      disabled: true
    });
    // console.log(app.globalData.accessToken);
    this.authorizePay(orderId);
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
                var flag = 2;
                wx.navigateTo({
                  url: '../maintain-result/maintain-result?flag=' + flag + '&orderId=' + orderId,
                })
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
          var flag = 2;
          wx.navigateTo({
            url: '../maintain-result/maintain-result?flag=' + flag + '&orderId=' + orderId,
          })
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
        var flag = 1;
        wx.redirectTo({
          url: '../maintain-result/maintain-result?flag=' + flag + '&orderNumber=' + that.data.orderNumber,
        })
        that.setData({
          // isPaySuccess: true,
          disabled: false
        })
      },
      'fail': function (res) {
        // console.log('fail:' + JSON.stringify(res));
        var flag = 2;
        wx.redirectTo({
          url: '../maintain-result/maintain-result?flag=' + flag + '&orderId=' + orderId,
        })
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
    this.getVerifyOrder(this.data.currentTab, this.data.page, this.data.size, this.data.flag);
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
    this.setData({ page: 1 });
    this.getVerifyOrder(this.data.currentTab, this.data.page, this.data.size, this.data.flag);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    this.setData({
      page: this.data.page + 1,
    })
    this.getVerifyOrder(this.data.currentTab, this.data.page, this.data.size, this.data.flag);
    // 隐藏加载框
    // wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})