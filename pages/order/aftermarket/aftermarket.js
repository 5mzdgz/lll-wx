// pages/order/aftermarket/aftermarket.js
import { Order } from '../../order/order-model.js';
var order = new Order();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    navbar: ['已处理', '待处理'],
    currentTab: 0,
    page:1,
    size:10,
    empty: false
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getStatusData(this.data.currentTab, this.data.page, this.data.size);
  },

  // 顶部tab切换
  navbarTap: function (e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    this.setData({
      currentTab: index
    })
    this.getStatusData(this.data.currentTab,this.data.page,this.data.size);
  },
  // 售后数据
  getStatusData: function (currentTab,page,size) {
    var current;
    if (currentTab == 0) {
      current = 6;
    } else if(currentTab == 1) {
      current = 5;
    }
    order.getOrderData(current, page, size,(resData)=>{
      // console.log(resData);
      if(resData.length > 0) {
        this.setData({
          afterArr: resData,
          empty: false
        })
      } else {
        this.setData({
          afterArr: resData,
          empty: true
        })
      }
    })
  },
  // 查看订单
  seeOrderTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    // console.log(orderId);
    wx.navigateTo({
      url: '../../order/detail/detail?orderId=' + orderId,
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