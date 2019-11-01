// pages/category/category.js
import { Category } from 'category-model.js';
var category = new Category();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: false,
    currentMenuIndex: app.globalData.categoryId,
    loadingHidden: false,
    page:1,
    size:10,
    sort: '',
    isSelect: false,
    isActive: false,
    isSort: false,
    moreGoods: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData:function() {
    var that = this;
    category.getCategoryType((categoryData) => {
      // console.log(categoryData)
      that.setData({
        categoryTypeArr: categoryData,
        loadingHidden: true
      })
    });

    this.getCategoryProducts(this.data.page, this.data.size, app.globalData.categoryId, this.data.sort);
  },
  /* 切换分类 */
  changeCategory:function(event) {
    var index = category.getDataSet(event, 'index');
    this.setData({
      page: 1,
      moreGoods: false,
      sort: '',
      isActive: false,
      isSelect: false,
      isSort: false,
      categoryDataArr: []
    });
    // 显示加载图标
    wx.showLoading({ title: '加载中' });
    this.getCategoryProducts(this.data.page, this.data.size, index,'');
    app.globalData.categoryId = index
  },

  /* 点击排序 */
  productSort: function (event) {
    var sort = category.getDataSet(event, 'sort');
    // console.log(sort)
    this.setData({
      page: 1,
      sort: sort,
      // 重置价格各个状态
      isSelect: false,
      isSort: false,
      isActive: false,
    })

    this.getCategoryProducts(this.data.page, this.data.size, app.globalData.categoryId, this.data.sort);
  },

  /* 点击价格排序 */
  productPriceSort: function (event) {
    if (this.data.isActive) {
      this.setData({
        page: 1,
        sort: 'priceAsc',
        isSort: true,
        isActive: false,
        isSelect: true
      })
    } else {
      this.setData({
        page: 1,
        sort: 'priceDesc',
        isSort: false,
        isActive: true,
        isSelect: true
      })
    }

    this.getCategoryProducts(this.data.page, this.data.size, app.globalData.categoryId, this.data.sort);
  },

  /**
   * 获取商品分类数据
   */
  getCategoryProducts:function(page,size,index,sort, callback){
    // console.log(index)
    category.getProductsByCategory(page, size, index, sort, (categoryArr) => {
      // console.log(categoryArr)
      if (page > 1) {
        // console.log('大于1')
        var categoryDataArr = this.data.categoryDataArr;
        // 返回集合
        if (categoryArr.length > 0) {
          categoryArr.forEach((item) => {
            categoryDataArr.push(item);
          })
        } 
      }else{
        var categoryDataArr = categoryArr;
      }
      // 隐藏加载框
      wx.hideLoading();
      this.setData({
        loadingHidden: true,
        currentMenuIndex: index,
        categoryDataArr: categoryDataArr
      })
    })
  },
  //
  onProductItems:function(event) {
    var id = category.getDataSet(event, 'id');
    // console.log(id)
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  /*分享*/
  onShareAppMessage:function() {
    var path;
    var loginToken = wx.getStorageSync('loginToken');
    var grade = wx.getStorageSync('grade');
    var scene = wx.getStorageSync('sceneId');
    if (grade && grade > 0) {
      path = 'pages/category/category?scene=' + scene;
    } else {
      path = 'pages/category/category';
    }
    
    return {
      title: '老良利珠宝',
      path: path
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.categoryId !== this.data.currentMenuIndex) {
      this._loadData();
    }
  },

  /* 下拉刷新 */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      moreGoods: false
    })
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this._loadData(() => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    });
    wx.stopPullDownRefresh();
  }, 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    // 显示加载图标
    wx.showLoading({ title: '加载中' });
    // 页数+1
    this.setData({
      page: this.data.page + 1,
    });

    this.getCategoryProducts(this.data.page, this.data.size, app.globalData.categoryId, this.data.sort);
  }
})