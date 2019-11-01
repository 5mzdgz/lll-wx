// pages/my/coupon-product/coupon-product.js
import { CouponProduct } from 'coupon-product-model.js';
var couponProduct = new CouponProduct();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    page: 1,
    size: 10,
    loadingHidden: false,
    sort:'',
    isSelect: false,
    isActive: false,
    isSort: false,
    moreGoods: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var couponObj = JSON.parse(options.str);
    // console.log(couponObj);
    this.setData({
      couponObj: couponObj
    })
    // console.log(this.data.sort)
    this.getCouponProductList(this.data.couponObj,this.data.page, this.data.size, this.data.sort);
  },


  /* 点击排序 */
  productSort: function (e) {
    var sort = e.currentTarget.dataset.sort;
    this.setData({
      page: 1,
      sort: sort,
      // 重置价格各个状态
      isSelect: false,
      isSort: false,
      isActive: false,
    })

    this.getCouponProductList(this.data.couponObj, this.data.page, this.data.size, this.data.sort);
  },

  /* 点击价格排序 */
  productPriceSort: function (event) {
    this.isActive = !this.isActive
    if (this.isActive) {
      this.setData({
        page: 1,
        sort: 'priceDesc',
        isSort: false,
        isActive: true,
        isSelect: true
      })
    } else {
      this.setData({
        page: 1,
        sort: 'priceAsc',
        isSort: true,
        isActive: false,
        isSelect: true
      })
    }

    this.getCouponProductList(this.data.couponObj, this.data.page, this.data.size, this.data.sort);
  },

  // 获取优惠卷可以使用的商品
  getCouponProductList: function (couponObj, page, size, sort) {
    var that = this;
    // 组装去使用的数据
    if(page > 1) {
      // 请求
      couponProduct.getCouponProductData(couponObj, page, size, sort, (resData) => {
        // console.log(resData)
        var cplist = this.data.cplist;
        if (resData.length > 0) {
          resData.forEach((item) => {
            cplist.push(item);
          })
          this.setData({
            cplist: cplist,
            loadingHidden: true
          })
        } else {
          this.setData({
           moreGoods: true
          })
        }
      })
    } else {
      // 请求
      couponProduct.getCouponProductData(couponObj, page, size, sort, (resData) => {
        // console.log(resData)
        this.setData({
          cplist: resData,
          loadingHidden: true
        })
      })
    }
  },
  // 跳转详情页
  onRecommendItems:function(e) {
    var id = e.currentTarget.dataset.id;
    // console.log(id);
    wx.navigateTo({
      url: '../../product/product?id=' + id,
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    // var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    this.setData({
      page: this.data.page + 1,
    })

    this.getCouponProductList(this.data.couponObj, this.data.page, this.data.size);

    // console.log(this.data.cplist)
    // 隐藏加载框
    wx.hideLoading();
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

  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/home/home',
      // imageUrl: '/image/common/logo@2x.png'
    }
  }
})