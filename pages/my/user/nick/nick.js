// pages/my/nick/nick.js
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
    // console.log(options.nickName);
    var nickName = options.nickName
    if (nickName === '未填写') {
      nickName = '';
    }
    this.setData({
      nickName: nickName
    })
  },

  bindFormSubmit: function (e) {
    // console.log(e.detail.value.textarea)
    var loginToken = wx.getStorageSync('loginToken');
    var tNickname = e.detail.value.textarea;
    wx.request({
      url: Config.memberUrl + '/l/v1/user/nickname/update',
      data:{
        nickname: encodeURIComponent(tNickname)
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken,
      },
      success:function(res) {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})