// pages/my/maintain/mail/mail.js
import { Mail } from 'mail-model.js';
var mail = new Mail();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    addressId: null,
    orderNumber: null,
    orderId: null,
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderNumber = options.orderNumber;
    var orderId = options.orderId
    // console.log(orderNumber)
    // console.log(orderId)
    this.setData({
      orderNumber: orderNumber,
      orderId: orderId
    })
  },

  /**
   * 添加地址
   */
  addAddressTap: function() {
    wx.navigateTo({
      url: '../../address/address?addressFlag=1',
    })
  },
  /**
   * 获取
   */
  bindCourierTap: function(e) {
    var shippingCode = e.detail.value.shippingCode;
    var obj = {
      shippingCode: shippingCode,
      addressId: this.data.addressId,
      orderNumber: this.data.orderNumber
    }
    // console.log(obj);
    if (obj.shippingCode && obj.addressId) {
      mail.postMailData(obj, (resData) => {
        // console.log(resData);
        if (resData.code === '200') {
          this.setData({ disabled: true });
          wx.redirectTo({
            url: '../maintain-result/maintain-result?flag=4' + '&orderId=' + this.data.orderId,
          })
        } else {
          wx.showToast({
            title: '提交失败',
          })
        }
      })
    }
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