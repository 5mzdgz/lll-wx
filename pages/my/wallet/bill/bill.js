// pages/my/wallet/bill/bill.js
import {
  Bill
} from 'bill-model.js';
var bill = new Bill();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBillArr(this.data.page, this.data.size);
  },

  /**
   * 获取列表
   */
  getBillArr: function(page, size) {
    
    if (page > 1) {
      bill.billArr(page, size, (res) => {
        // console.log(res)
        if (res.data && res.data.length > 0) {
          var billArr = this.data.billArr;
          res.data.forEach((item) => {
            item.payImg = 'https://img.laoliangli.com/label/wallet/money_icon.png';
            var consumAmount = item.consumAmount.toFixed(2);
            item.consumAmount = consumAmount;
            billArr.push(item);
          })
          this.setData({
            billArr: billArr
          })
        }
      })
    } else {
      bill.billArr(page, size, (res) => {
        // console.log(res)
        res.data.forEach((item) => {
          item.payImg = 'https://img.laoliangli.com/label/wallet/money_icon.png';
          var consumAmount = item.consumAmount.toFixed(2);
          item.consumAmount = consumAmount;
        })
        this.setData({
          billArr: res.data,
        })
        // console.log(this.data.billArr)
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    this.getBillArr(this.data.page, this.data.size,()=>{
      wx.hideNavigationBarLoading();
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      page: this.data.page + 1
    })
    // console.log(this.data.page)
    this.getBillArr(this.data.page, this.data.size);
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})