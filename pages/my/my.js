// pages/my/my.js
import { My } from 'my-model.js';
import { Invitation } from 'invitation/invitation-model.js';
var invitation = new Invitation();
var my = new My();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iShou:false,
    showIcon: false,
    tabbarTitle: null,
    userName: null,
    userHeadImg: null,
    orderStatusArr: [
      { id: 0, statusName: '待支付', statusImgUrl: 'https://img.laoliangli.com/label/my/pay_icon.png' },
      { id: 1, statusName: '待发货', statusImgUrl: 'https://img.laoliangli.com/label/my/shipped_icon.png' },
      { id: 2, statusName: '待收货', statusImgUrl: 'https://img.laoliangli.com/label/my/received_icon.png' },
      { id: 3, statusName: '已完成', statusImgUrl: 'https://img.laoliangli.com/label/my/finished_icon.png' },
      { id: 4, statusName: '售 后 ', statusImgUrl: 'https://img.laoliangli.com/label/my/aftermarket_icon.png' },
    ],
    maintainArr: [
      { id: 0, navTitle: '首饰保养', iconImg: 'https://img.laoliangli.com/label/my/maintain_icon.png' },
      { id: 0, navTitle: '订单审核', iconImg: 'https://img.laoliangli.com/label/my/maintain_status_icon.png' },
      { id: 0, navTitle: '保养订单', iconImg: 'https://img.laoliangli.com/label/my/maintain_order_icon.png' }
    ]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCode();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfoData();
  },

  getUserInfoData: function() {
    my.userInfo((infoData) => {
      // console.log(infoData)
      if (infoData.code === '200') {
        var resData = infoData.data;
        // console.log(resData)
        var headImgUrl = resData.headImgUrl;
        var nickname = decodeURIComponent(resData.nickname);
        var autograph = decodeURIComponent(resData.autograph);
        // console.log(autograph)
        app.globalData.phone = resData.account;
        wx.setStorageSync('phone', resData.account);
        wx.setStorageSync('grade', resData.grade);
        wx.setStorageSync('sceneId', resData.id);
        app.globalData.scene = resData.id;

        this.setData({
          userName: nickname,
          headImgUrl: headImgUrl,
          autograph: autograph,
          grade: resData.grade
        })
        // }
      } else if (infoData.code === '90001' || infoData.code === '90002') {
        // console.log(infoData)
        app.getAccessToken();
        this.getUserInfoData();
      }
    })
  },

  // 跳转设置
  changeUserInfo:function() {
    if (this.data.grade) {
      wx.navigateTo({
        url: '../my/set/set?grade=' + this.data.grade,
      })
    } else {
      wx.navigateTo({
        url: '../my/set/set',
      })
    }
  },
  // 跳转订单管理
  orderTap:function() {
    wx.navigateTo({
      url: '../order/order?index=0',
    })
  },
  // 订单状态栏
  orderStatusTap: function(e) {
    var index = e.currentTarget.dataset.index + 1;
    // console.log(index)
    if(index==5) {
      wx.navigateTo({
        url: '../order/aftermarket/aftermarket?index=' + index,
      })
    } else {
      wx.navigateTo({
        url: '../order/order?index=' + index,
      })
    }
  },
  /**
   * 保养
   */
  maintainTap: function() {
    wx.navigateTo({
      url: '../my/maintain/maintain',
    })
  },

  /**
   * 保养选项
   */
  maintainItemTap: function(e) {
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    if (index === 0) {
      wx.navigateTo({
        url: '../my/maintain/maintain',
      })
    } else {
      wx.navigateTo({
        url: '../my/maintain/maintain-order/maintain-order?flag=' + index,
      })
    }
  },

  // 地址管理
  address:function() {
    wx.navigateTo({
      url: '../my/address/address',
    })
  },
  // 关于我们
  about:function() {
    wx.navigateTo({
      url: '../my/about/about',
    })
  },
  // 收藏管理
  collection:function() {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  // 跳转到优惠卷
  coupon:function() {
    wx.navigateTo({
      url: '../my/coupon/coupon',
    })
  },
  // 跳转到客服
  handleContact() {
    // console.log()
    wx.navigateTo({
      url: '../my/server/server',
    })
  },
  // 跳转到优惠卷
  opinion: function () {
    wx.navigateTo({
      url: '../my/opinion/opinion',
    })
  },
  // 切换账号
  switchTap:function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数-- 监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * 获取二维码
   */
  getCode: function () {

    var obj = {
      path: "pages/home/home",
      scene: app.globalData.scene,
      auto_color: false,
      width: 300
    }
    var codeImgUrl = wx.getStorageSync('codeImgUrl');
    if (!codeImgUrl) {
      invitation.code(obj, (data) => {
        this.downCode(data)
      });
    }
  },
  /**
   * 下载二维码
   */
  downCode: function (invitationCode) {
    wx.getImageInfo({
      src: invitationCode,
      success: function (res) {
        wx.setStorageSync('codeImgUrl', res.path);
        // console.log(posterBgmArr);
      },
      fail: function (err) {
        // console.log(err)
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.getUserInfo();
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
    return {
      title: '老良利珠宝',
      path: 'pages/home/home',
      imageUrl: 'https://img.laoliangli.com/label/invitation/share.png'
    }
  }
})