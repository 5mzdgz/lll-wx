// pages/my/address/address.js
import { Config } from '../../../utils/config.js';
import { Address } from 'address-model.js';
const app = new getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    addressList: [],
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    // 接收下单页传过来的addressFlag
    if (options.addressFlag) {
      var addressFlag = options.addressFlag;
      this.setData({
        addressFlag: addressFlag
      });
    }
  },
  onShow: function () {
    this.getUserAddrss();
  },

  // 获取用户地址
  getUserAddrss:function() {
    var that = this;
    var loginToken = wx.getStorageSync('loginToken');
    
    // console.log(accessToken);
    wx.request({
      url: Config.memberUrl + '/l/v1/user/address/list',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken,
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code === '200') {
          that.setData({
            addressList: res.data.data
          })
          // console.log(that.data.addressList)
        } 
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  },
  // 删除函数
  deleteAddressItem: function(e) {
    var that = this;
    var id = e.target.dataset.id;
    var loginToken = wx.getStorageSync('loginToken');

    wx.request({
      url: Config.memberUrl + '/l/v1/user/address/delete?ids=' + id,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken,
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code === '200') {
          that.onShow();
        }
        app.returnCode(res.data.code, res.data.msg);

      }
    })
  },

  // 点击删除，跳出弹窗
  deleteTap:function(e) {
    var that = this;
    wx.showModal({
      title: '删除地址',
      content: '确定要删除该地址？',
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
          that.deleteAddressItem(e);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 设为默认地址
  setDefaultAddress:function(e) {
    var that = this;
    var address = new Address();
    var id = e.target.dataset.id;
    // console.log(id)
    address.addressRequest(id,(resSet) => {
      that.onShow();
      // console.log(resSet)
    })
  },

  //编辑地址
  setEdit:function(e) {
    var id = e.target.dataset.id
    // console.log(id);
    wx.navigateTo({
      url: '../../my/new-address/new-address?id=' + id,
    })
  },
 
  // 点击跳转添加新地址
  newAddressTap: function() {
    wx.navigateTo({
      url: '../../my/new-address/new-address'
    })
  },
  // 用户从下单页选择地址
  selectedAddressId: function(e) {
    if (this.data.addressFlag == 1) {
      var pages = getCurrentPages();
      var addressId = e.currentTarget.dataset.id
      var userName = e.currentTarget.dataset.username;
      var userPhone = e.currentTarget.dataset.userphone;
      var province = e.currentTarget.dataset.province;
      var city = e.currentTarget.dataset.city;
      var area = e.currentTarget.dataset.area;
      var address = e.currentTarget.dataset.address;
      // console.log(addressId);
      //console.log(item);
      // 获取当前页面
      // var currPage = pages[pages.length - 1];
      // 获取上一页
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        addressId: addressId,
        userName: userName,
        userPhone: userPhone,
        province: province,
        city: city,
        area: area,
        address: address,
        isAddress: true
      })
      //console.log(prevPage.data.cpList);
      // 获取地址id回传到确认订单页
      wx.navigateBack({
        delta: 1
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