// pages/my/autograph/autograph.js

import { Config } from '../../../../utils/config.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.autograph)
    var autograph = options.autograph;
    if (autograph === '未填写'){
      autograph = '';
    }
    this.setData({
      autograph: autograph
    })
  },

  authFormSubmit: function (e) {
    // console.log(e.detail.value.textarea)
    var loginToken = wx.getStorageSync('loginToken');
    var tAuth = e.detail.value.textarea;
    wx.request({
      url: Config.memberUrl + '/l/v1/user/autograph/update',
      data: {
        autograph: encodeURIComponent(tAuth)
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken,
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code === '200') {
          wx.navigateBack({
            delta: 1
          })
        }
        app.returnCode(res.data.code, res.data.msg);
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