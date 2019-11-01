//app.js
import { Config } from 'utils/config.js';
import { Home } from 'pages/home/home-model.js';
var home = new Home();

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 判断是否有新版本，重启应用
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                // console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    
    wx.getSystemInfo({
      success: res => {
        // console.log(res);
        this.globalData.phoneModel = res.model;
        this.globalData.sysversion = res.system;
        this.globalData.version = res.version;
        this.initIp();
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err) {
        // console.log(err);
      }
    })
    this.getPosterArr();
  },
  globalData: {
    inviteUser: null,
    scene: null,
    accessToken: null,
    phone: null,
    statusBarHeight: 0,
    titleBarHeight: 0,
    platform: 'applets',
    ipAddress: null,
    phoneModel :null,
    sysversion: null,
    imei: '1234567890',
    version:null,
    categoryId:0,
    shippingMethods:null,
    posterBgmArr: []
  },
  initIp: function () {
    // 获取用户IP
    var that = this;
    wx.request({
      url: Config.memberUrl + '/l/getip',
      success: function (e) {
        that.globalData.ipAddress = e.data.data;
        that.getAccessToken();
      },
      fail: function () {
        // console.log('ip')
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //获取token
  getAccessToken: function() {
    //console.log('getAccessToken');
    var that = this;
    var headerParam = {
      'platform': this.globalData.platform,
      'ipAddress': this.globalData.ipAddress,
      'sysversion': this.globalData.sysversion,
      'imei': this.globalData.imei,
      'phoneModel': this.globalData.phoneModel,
      'version': this.globalData.version
    };
    //console.log(headerParam);
    wx.request({
      url: Config.memberUrl + '/l/v1/get/accessToken',
      method: 'POST',
      header: headerParam,
      success: function(res) {
        if (res.data.code === '200') {
          that.globalData.accessToken = res.data.data;
          that.getShippingMethods(that);
        } else {
          //获取授权码失败
          // 可以提示网络异常
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  returnCode: function(code,msg){
    // console.log(code)
    if(code === '200'){
      return;
    }
    if (code === '90002' || code === '90001') {
      // 可以提示网络异常
      // console.log('9001')
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 1000
      })
      this.getAccessToken();
    }else if (code === '105'){
      // 未登录 --》去登录
      wx.showToast({
        title: '请重新登录',
        icon: 'none',
        duration: 1000
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  //获取物流列表
  getShippingMethods: function (that) {
    var headerParam = {
      'accessToken': that.globalData.accessToken
    };
    wx.request({
      url: Config.orderUrl + '/shipping/list',
      method: 'GET',
      header: headerParam,
      success: function (res) {
        that.returnCode(res.data.code,res.data.msg);
        if (res.data.code === '200') {
          // console.log(that.globalData.shippingMethods)
          that.globalData.shippingMethods = res.data.data;
          // console.log(that.globalData.shippingMethods)
        }
      }
    })
  },
  /**
   * 获取并下载邀请有礼海报背景图
   */
  getPosterArr: function () {
    var that = this;
    var banner = 'INVITE_USER';
    var posterBgmArr = [];

    home.getBannerData(banner, (banData) => {
      var posterArr = banData.INVITE_CENTER;
      posterArr.forEach((item) => {
        wx.getImageInfo({
          src: item.imgUrl,
          success: function (res) {
            // console.log(res.path)
            posterBgmArr.push(res.path);
            wx.setStorageSync('posterBgmArr', posterBgmArr);
          },
          fail: function (err) {
            //  console.log(err)
          }
        });
      })
    });
  },
})