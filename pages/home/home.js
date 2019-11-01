// pages/home/home.js
import { Home } from 'home-model.js';
import { Category } from '../category/category-model.js';
var home = new Home();
var category = new Category();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: false,
    indicatorDots: true,
    bannerAutoplay: true,
    newAutoplay: false,
    circular: true,
    newCircular: true,
    interval: 5000,
    duration: 500,
    current: 0,
    index: 0,
    newCurrent: 0,
    loadingHidden: false,
    moreGoods: false,
    isPop: false,
    page: 1,
    size: 10,
    lable: 'hot',
    random: 0,
    categroyArr:[
      { 
        id: 0, 
        categoryName: '全部', 
        categoryImgUrl: 'https://img.laoliangli.com/label/home/Whole.png', 
        categoryDescription: 'all',
        level: 1, 
        sort: 0
      }
    ]
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  swiperBannerChange: function (e) {
    this.setData({
      current: e.detail.current,
    })
  },
  swiperNewChange: function (e) {
    this.setData({
      newCurrent: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 分享邀请
    var scene = decodeURIComponent(options.scene)
    // console.log(scene)
    if (scene > 0){
      wx.setStorageSync('scene', scene);
      this.setData({ isPop: true });
    }
    
    this.loadBannerData();
    // this.getCategroy();
    this.getNewProducts('new', this.data.page, 12);
    this.getRecommend(this.data.lable, this.data.page, this.data.size);
  },
  /**
   * 分类导航
   */
  getCategroy: function() {
    category.getCategoryType((categoryData) => {
      // console.log(categoryData)
      var categroyArr = this.data.categroyArr;
      categoryData.forEach((item) => {
        categroyArr.push(item);
      })
      this.setData({
        categroyArr: categroyArr,
        loadingHidden: true
      })
    });
  },
  /**
   * 根据广告links跳转相应页面
   */
  goLinksTap: function(e) {
    var item = e.currentTarget.dataset.item;
    // console.log(item);
    // console.log(item.links.indexOf('/pages/my/'));
    var links = item.links;
    // console.log(links);
    var count = links.indexOf('/pages/my/');
    var category = links.indexOf('/pages/category/category');
    var invitation = links.indexOf('/pages/my/invitation');
    var loginToken = wx.getStorageSync('loginToken');
    var grade = wx.getStorageSync('grade');
    if (item.type === 2) {
      //小程序个人中心页
      if (count === 0) {
        if (!loginToken) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          if (invitation === 0) {
            if (grade === 0) {
              wx.navigateTo({
                url: '../my/set/reset-password/reset-password?flag=3',
              })
            } else {
              wx.navigateTo({
                url: links,
              })
            }
          } else {
            wx.navigateTo({
              url: links,
            })
          }
        }
      } else {
        // 小程序内分类页
        if (category === 0) {
          var categoryId = links.replace(/[^0-9]/ig, "");
          
          // console.log(categoryId)
          app.globalData.categoryId = categoryId;
          wx.switchTab({
            url: '/pages/category/category',
          })
        } else {
          wx.navigateTo({
            url: links,
          })
        }
      }
    } else if (item.type === 1) {
      //小程序以外的页面
      wx.navigateTo({
        url: '../order/out/out?shippingUrl=' + encodeURIComponent(links),
      })
    } else if (item.type === 3) {
      var str =JSON.stringify(item);
      //小程序以外的页面
      wx.navigateTo({
        url: '../order/show/show?str=' + str,
      })
    }
  },
  /**
   * 获取新品上线
   */
  getNewProducts: function (lable, page, size) {
    home.newProducts(lable, page, size, (newData) => {
      // console.log(newData);
      this.setData({
        sliderNew: newData
      })
    })
  },
  /**
   * 去注册
   */
  registerTap: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 关闭
   */
  closeInvitationTap: function () {
    this.setData({ isPop: false });
  },
  /**
   * 获取轮播图数据
   */
  loadBannerData:function(){
    var banner = 'APPLET_HOME';
    // var banner = 'MOBILE_HOME';
    home.getBannerData(banner, (banData) => {
      // console.log(banData)
      this.setData({
        slider: banData.TOP,
        loadingHidden: true
      })
    });
  },
  /**
   * 获取热销数据
   */
  getRecommend: function (lable, page, size) {
    home.getRecommendData(lable, page, size, (recomData) => {
      if (page > 1) {
        var recommendData = this.data.recommendData;
        if (recomData.length > 0) {
          recomData.forEach((item) => {
            recommendData.push(item);
          })
        }
      } else {
        var recommendData = recomData;
      }
      // 隐藏加载框
      wx.hideLoading();
      this.setData({
        recommendData: recommendData,
        loadingHidden: true
      })
    })
  },
  /**
   * 点击跳商品详情页
  */
  onRecommendItems:function(event) {
    var id = home.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },
  /**
   * 跳转到分类页下项
  */
  onCategoryItems: function (event) {
    var that = this;
    var id = home.getDataSet(event, 'id');
    app.globalData.categoryId = id
    wx.showLoading({
      title: '加载中',
    })
    wx.switchTab({
      url :'../category/category'
    })
  },

  /* 下拉刷新 */
  onPullDownRefresh: function () {
    this.setData({ page: 1 });

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.loadBannerData(() => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    });
    // this.getCategroy();
    this.getNewProducts('new', this.data.page, 12);
    this.getRecommend(this.data.lable, this.data.page, this.data.size);
    wx.stopPullDownRefresh();
  }, 
  /**
   * 上拉加载
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({ title: '加载中' });
    // 页数+1
    this.setData({
      page: this.data.page + 1
    }) 
    this.getRecommend(this.data.lable, this.data.page, this.data.size);
  },
  /**
   * 随机数
   */
  getRandomNumberByRange: function (isRandom, start, end) {
    var random = Math.floor(Math.random() * (end - start) + start);
    while (isRandom === random) {
      return Math.floor(Math.random() * (end - start) + start);
    }
    return random
  },
  /*分享*/
  onShareAppMessage: function () {
    var path;
    var loginToken = wx.getStorageSync('loginToken');
    var grade = wx.getStorageSync('grade');
    var scene = wx.getStorageSync('sceneId');
    if (grade && grade > 0) {
      path = 'pages/home/home?scene=' + scene;
    } else {
      path = 'pages/home/home';
    }

    var slider = this.data.slider;
    var random = this.getRandomNumberByRange(this.data.random, 0, slider.length);
    this.setData({
      random: random
    })

    // console.log(random);
    return {
      title: '老良利珠宝',
      path: path,
      imageUrl: slider[random].imgUrl
    }
  }
})