// pages/my/opinion/opinion.js
import { Config } from '../../../utils/config.js';
import { Opinion } from 'opinion-model.js';
var opinion = new Opinion();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    textarea: '写下老良利商城的功能建议或发现的系统问题，么么哒！',
    count: 6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 添加图片
  addImgTap:function() {
    var that = this;
    wx.chooseImage({
      count: this.data.count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 提交反馈
   */
  bindFormSubmit:function(e) {
    var feedbackContent = e.detail.value.textarea;
    // console.log(feedbackContent);
    var imageFile = this.data.imageList;
    var self = this;
    var data = {
      url: Config.memberUrl + '/l/v1/upload/image?folder=feedback',//这里是你图片上传的接口
      path: imageFile,//这里是选取的图片的地址数组
    }
    var uploadImages;
    // console.log(imageFile);

    if (!imageFile) {
      wx.showToast({
        title: '至少上传一张图片',
        icon: 'none'
      })
      return false;
    } 
    if (!feedbackContent) {
      wx.showToast({
        title: '意见内容不得为空',
        icon: 'none'
      })
      return false;
    } 
    opinion.uploadimg(data, uploadImages, feedbackContent, self);
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