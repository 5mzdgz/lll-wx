// pages/my/wallet/wallet.js
import { Config } from '../../../utils/config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    isOpen: true,
    amount: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWalletAcount();
  },

  /**
   * 获取钱包金额
   */
  getWalletAcount: function () {
    var that = this;
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/wallet',
      method: 'GET',
      header:{
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function(res) {
        // console.log(res)
        app.returnCode(res.data.code, res.data.msg);
        if (res.data.code === '212') {
          that.setData({
            isOpen: false
          })
        } else {
          that.setData({
            isOpen: true,
            amount: res.data.data.amount
          })
        }
      }
    })
  },
  /**
   * 去充值
   */
  rechargeTap: function() {
    wx.navigateTo({
      url: '../wallet/recharge/recharge',
    })
  },

  /***
   * 去提现
   */
  cashTap: function() {
    wx.navigateTo({
      url: '../wallet/cash/cash?amount=' + this.data.amount,
    })
  },
  /**
   * 查看账单
   */
  billsTap:function() {
    wx.navigateTo({
      url: '../wallet/bill/bill',
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