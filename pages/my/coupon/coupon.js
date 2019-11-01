import { Coupon } from 'coupon-model.js';
var coupon = new Coupon();
const app = getApp();

Page({
  data: {
    showIcon: true,
    tabbarTitle: '优惠卷',
    loadingHidden: false,
    isCoupon: false,
    status: 0,
    page: 1,
    size: 10
  },
  onLoad: function (options) {
    // this.orderCouData(object);
    this.getConponList(this.data.status,this.data.page, this.data.size);
  },

  // 获取优惠卷列表
  getConponList: function (status, page, size) {
    coupon.getCouponData(status, page, size, (resData)=> {
      // console.log(resData);
      if (page > 1) {
        var couponData = this.data.couponData;
        if (resData.length > 0) {
          this.couponHandle(resData);
          resData.forEach((item) => {
            couponData.push(item);
          })
        }
      } else {
        if (resData.length > 0) {
          this.couponHandle(resData);
        }
        var couponData = resData;
      }
      // 隐藏加载框
      wx.hideLoading();
      // console.log(resData);
      this.setData({
        couponData: couponData,
        loadingHidden: true
      })
    })
  },
  /**
   * 数据处理
   */
  couponHandle: function(resData) {
    for (var i = 0; i < resData.length; i++) {
      if (resData[i].couponType === 2) {
        var discount = resData[i].discount * 10;
        resData[i].discount = discount;
      }
      var timestamp = new Date().getTime();
      // var etime = Date.parse(new Date(resData[i].endTime)); 
      var etime = new Date(resData[i].endTime.replace(/\-/g, '/')).getTime();
      var usedTime = etime - timestamp; //两个时间戳相差的毫秒数
      var expirationTime = Math.floor(usedTime / (24 * 3600 * 1000));
      resData[i].expirationTime = expirationTime
    }
  },
  // 去使用
  goUseTap:function(e) {
    // 优惠卷编码
    var couponCode = e.currentTarget.dataset.coupon;
    // console.log('couponCode', couponCode)
    // 通过优惠卷编码获取该项数据
    var checkCouponData = this.data.couponData.find((item)=> {
      return item.couponCode == couponCode
    })
    // console.log('couponCode', checkCouponData.couponCode)
    var obj = {
      useType: checkCouponData.useType,
      useIds: checkCouponData.useIds,
      excludeProductIds: checkCouponData.excludeProductIds,
    };
    var str = JSON.stringify(obj)
    // 传值
    wx.navigateTo({
      url: '../../my/coupon-product/coupon-product?str=' + str,
    })
  },
  /* 下拉刷新 */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    // console.log('111')
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
   
    this.getConponList(this.data.status, this.data.page, this.data.size,() => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    });
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    this.setData({
      page: this.data.page + 1,
    })
    this.getConponList(this.data.status, this.data.page, this.data.size);
  },
  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/category/category',
      // imageUrl: '/image/common/logo@2x.png'
    }
  }
})