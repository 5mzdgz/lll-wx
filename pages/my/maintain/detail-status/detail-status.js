// pages/my/maintain/detail-status/detail-status.js
import { Config } from '../../../../utils/config.js';
import { Status } from 'status-model.js';
import { MatOrder } from '../maintain-order/matOrder-model.js';
var matOrder = new MatOrder();
var status = new Status();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    orderData: null,
    orderId: null,
    orderNumber: null,
    disabled: false,
    isOpinion: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId;
    this.setData({ orderId: orderId });
    // this.getStatusData(orderId);
  },

  /**
   * 获取订单详情
   */
  getStatusData: function (orderId) {
    status.statusData(orderId, (resData) => {
      // console.log(resData);
      // banner及icon
      switch (resData.orderStatus) {
        case 1:
          resData.bannerImg = 'https://img.laoliangli.com/label/common/banner_status.png';
          resData.statusIcon = 'https://img.laoliangli.com/label/common/shipped.png';
          break;
        case 2:
          resData.bannerImg = 'https://img.laoliangli.com/label/common/banner_status.png';
          resData.statusIcon = 'https://img.laoliangli.com/label/common/maintenance.png';
          resData.statusTitle = '保养中';
          resData.statusSub = '';
          resData.statusSubtitle = '工艺师正在对首饰进行保养，请耐心等待';
          break;
        case 3:
          resData.bannerImg = 'https://img.laoliangli.com/label/common/banner_status.png';
          resData.statusIcon = 'https://img.laoliangli.com/label/common/received.png';
          resData.statusTitle = '寄回中';
          resData.statusSub = '';
          resData.statusSubtitle = '首饰已保养完成，正在寄回中，请耐心等待';
          break;
        case 4:
          resData.bannerImg = 'https://img.laoliangli.com/label/common/banner_status.png';
          resData.statusIcon = 'https://img.laoliangli.com/label/common/finished.png';
          resData.statusTitle = '已完成';
          resData.statusSub = '';
          resData.statusSubtitle = '交易已完成';
          break;
        case 5:
          resData.bannerImg = 'https://img.laoliangli.com/label/common/banner_status_refuse.png';
          resData.statusIcon = 'https://img.laoliangli.com/label/common/refuse.png';
          resData.statusTitle = '已拒收';
          resData.statusSub = '';
          resData.statusSubtitle = '已拒收，请查看拒收原因，平台已经安排退款';
          break;
        default:
          resData.bannerImg = 'https://img.laoliangli.com/label/common/banner_status.png';
          resData.statusIcon = 'https://img.laoliangli.com/label/common/finished.png'
      }

      // 状态内容
      if (resData.checkStatus === 0 && resData.uploadImgs) {
        resData.statusTitle = '审核中';
        resData.statusSub = '';
        resData.statusSubtitle = '工艺师正在审核资料，请您耐心等待~';
      } else if (resData.checkStatus === 0 && !resData.uploadImgs) {
        resData.statusTitle = '审核中';
        resData.statusSub = '（待上传实物照片）';
        resData.statusSubtitle = '工艺师正在审核资料，请您耐心等待~';
      } else if (resData.checkStatus == 1 && resData.orderStatus == 0) {
        resData.statusTitle = '审核通过';
        resData.statusSub = '';
        resData.statusSubtitle = '维修单号：' + resData.orderNumber;
      } else if (resData.orderStatus == 1 && !resData.userShippingCode) {
        resData.statusTitle = '待寄出';
        resData.statusSub = '（请您寄出快递后，填写快递信息）';
        resData.statusSubtitle = '维修单号：' + resData.orderNumber;
      } else if (resData.orderStatus == 1 && resData.userShippingCode) {
        resData.statusTitle = '已寄出';
        resData.statusSub = '';
        resData.statusSubtitle = '维修单号：' + resData.orderNumber;
      } else if (resData.checkStatus === 2) {
        resData.bannerImg = 'https://img.laoliangli.com/label/common/banner_status_refuse.png';
        resData.statusIcon = 'https://img.laoliangli.com/label/common/refuse.png';
        resData.statusTitle = '审核未通过';
        resData.statusSub = '';
        resData.statusSubtitle = '请重新填写资料，提交申请吧~';
      }
      // console.log(resData);
      this.setData({
        orderData: resData,
        orderNumber: resData.orderNumber
      })
    })
  },

  /**
   * 复制物流单号
   * */
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
  /**
   * 确认收货
   */
  btnConfrimTap: function (e) {
    var that = this;
    // var orderId = e.currentTarget.dataset.id;
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
          matOrder.confrimData(that.data.orderId, (res) => {
            // console.log(res)
            if (res.code === '200') {
              that.getStatusData(that.data.orderId);
              that.setData({
                isOpinion: true
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
   * 意见反馈
   */
  btnOpinionTap: function() {
    wx.navigateTo({
      url: '../maintain-opinion/maintain-opinion?orderNumber=' + this.data.orderNumber,
    })
  },
  /**
   * 意见反馈
   */
  detailOpinionTap: function() {
    this.setData({ isOpinion: false });
  },
  /**
   * 重新申请
   */
  reapplyTap: function() {
    wx.navigateTo({
      url: '../maintain',
    })
  },
  /**
   * 填写快递单号
   */
  goFillNumbder: function() {
    wx.navigateTo({
      url: '../mail/mail?orderId=' + this.data.orderId + '&orderNumber=' + this.data.orderNumber,
    })
  },
  /**
   * 上传照片
   */
  uploadImgsTap: function(e) {
    var orderNumber = e.currentTarget.dataset.number;
    // console.log(orderNumber);
    wx.navigateTo({
      url: '../photograph/photograph?orderNumber=' + orderNumber + '&orderId=' + this.data.orderId,
    })
  },
  /**
   * 去支付
   */
  goPayTap: function (e) {
    var orderId = this.data.orderId;
    var orderNumber = this.data.orderNumber;
    this.setData({ disabled: true });
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
    this.getStatusData(this.data.orderId);
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