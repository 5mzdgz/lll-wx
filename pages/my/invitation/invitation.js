 // pages/my/invitation/invitation.js
import { Config } from '../../../utils/config.js';
import { Invitation } from 'invitation-model.js';
var invitation = new Invitation();
const app = getApp();
var openStatus = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    isCode: false,
    isPoster: false,
    isClause: false,
    indicatorDots: true,
    bannerAutoplay: false,
    circular: true,
    disabled: false,
    duration: 500,
    current: 0,
    index: 0,
    facePath: '',
    posterPath: null,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginToken = wx.getStorageSync('loginToken');
    var grade = wx.getStorageSync('grade');
    if (!loginToken) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    if (loginToken && !grade || grade === 0) {
      wx.navigateTo({
        url: '../set/reset-password/reset-password?flag=3',
      })
      return false;
    }
    this.getInvitationArr(this.data.page, this.data.size)
    this.getInvitationTotal();
    var posterBgmArr = wx.getStorageSync('posterBgmArr');
    if (!posterBgmArr) {
      app.getPosterArr();
    }
  },
  /**
   * 获取邀请好友列表
   */
  getInvitationArr: function (page, size) {
    invitation.invitationData(page, size, (data) => {
      // console.log(data)
      var resData = data.data;
      if (page > 1) {
        var userArr = this.data.userArr;
        if (resData.length > 0) {
          resData.forEach((item) => {
            this.userData(item);
            userArr.push(item);
          })
        }
      } else {
        if (resData.length > 0) {
          resData.forEach((item) => {
            this.userData(item);
          })
        }
        var userArr = resData;
      }
      wx.hideLoading();
      this.setData({
        userArr: userArr,
        totalRecord: data.page.totalRecord
      })
    })
  },

  /**
   * 数据处理
   */
  userData: function(item) {
    var nickName = decodeURIComponent(item.nickName);
    var dataItem = item.orderAmount.toFixed(2);
    var commission = item.cashBack + item.notCashBack;
    item.nickName = nickName;
    item.orderAmount = dataItem;
    item.commission = commission.toFixed(2);
    // 格式化时间
    var str = item.createTime;
    // console.log(str)
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate();
    var oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay);
    item.createTime = oTime;
  },
  //补0操作  
  getzf: function (num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  /**
   * 获取邀请提成统计
   */
  getInvitationTotal: function () {
    invitation.invitationTotal((data)=> {
      // console.log(data)
      this.setData({
        notReturnAmount: data.notReturnAmount.toFixed(2),
        returnAmount: data.returnAmount.toFixed(2),
        totalAmount: data.totalAmount.toFixed(2)
      })
    })
  },
  /**
   * 生成海报
   */
  generateTap: function () {
    var posterBgmArr = wx.getStorageSync('posterBgmArr');
    this.setData({
      posterBgmArr: posterBgmArr,
    });
    var posterPath = posterBgmArr[0];
    this.setData({
      isPoster: true,
      posterPath: posterPath
    });
  },
  /**
   * 选择海报
   */
  swiperBannerChange: function (e) {
    var posterBgmArr = wx.getStorageSync('posterBgmArr');
    var posterPath = posterBgmArr[e.detail.current];
    this.setData({
      current: e.detail.current,
      posterPath: posterPath
    })
  },
  /**
   * 绘制
   */
  confirmTap: function () {
    this.setData({ disabled: true });
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    var codeImgUrl = wx.getStorageSync('codeImgUrl');
    // console.log(codeImgUrl)
    context.drawImage(this.data.posterPath, 0, 0, 462, 822);
    context.save(); // 保存当前context的状态
    context.beginPath();
    context.drawImage(codeImgUrl, 28, 715, 75, 75);

    context.draw(false, function () {
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            // console.log(tempFilePath);
            that.drawImg(tempFilePath);
          },
          fail: function (res) {
            // console.log(res);
            that.setData({ disabled: false });
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 1000
            })
          }
        });
      }, 200);
    })
  },
  /**
   * 保存海报
   */
  drawImg: function (tempFilePath) {
    var that = this;
    // 获取用户是否开启用户授权相册
    if (!openStatus) {
      wx.openSetting({
        success: (result) => {
          if (result) {
            if (result.authSetting["scope.writePhotosAlbum"] === true) {
              openStatus = true;
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success() {
                  that.setData({ disabled: false });
                  wx.showToast({
                    title: '图片保存成功，快去分享到朋友圈吧~',
                    icon: 'none',
                    duration: 2000
                  })
                },
                fail(err) {
                  // console.log(err);
                  that.setData({ disabled: false });
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
        },
        fail: () => { },
        complete: () => { }
      });
    } else {
      wx.getSetting({
        success(res) {
          // 如果没有则获取授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                openStatus = true
                wx.saveImageToPhotosAlbum({
                  filePath: tempFilePath,
                  success() {
                    that.setData({ disabled: false });
                    wx.showToast({
                      title: '图片保存成功，快去分享到朋友圈吧~',
                      icon: 'none',
                      duration: 2000
                    })
                  },
                  fail(err) {
                    // console.log(err);
                    that.setData({ disabled: false });
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              },
              fail() {
                // 如果用户拒绝过或没有授权，则再次打开授权窗口
                openStatus = false
                // console.log('请设置允许访问相册')
                wx.showToast({
                  title: '请设置允许访问相册',
                  icon: 'none'
                })
              }
            })
          } else {
            // 有则直接保存
            openStatus = true
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success() {
                that.setData({ disabled: false });
                wx.showToast({
                  title: '图片保存成功，快去分享到朋友圈吧~',
                  icon: 'none',
                  duration: 2000
                })
              },
              fail(err) {
                // console.log(err);
                that.setData({ disabled: false });
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            })
          }
        },
        fail(err) {
          that.setData({ disabled: false });
          // console.log(err)
        }
      })
    }
  },

  /**
   * 当面申请
   */
  faceTap: function() {
    var invitationCode = wx.getStorageSync('invitationCode');
    this.setData({
      facePath: invitationCode,
      isCode: true
    })
  },
  /**
   * 取消保存海报
   */
  posterCancelTap:function() {
    this.setData({
      current: 0,
      isPoster: false
    })
  },

  /**
   * 活动规则
   */
  ruleTap: function () {
    this.setData({
      isClause: true
    })
  },
  /**
   * 取消按钮
   */
  ruleCancelTap: function () {
    this.setData({
      isClause: false
    })
  },

  /**
   * 隐藏
   */
  cancelTap:function () {
    this.setData({
      isCode: false
    })
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
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    this.getInvitationArr(this.data.page, this.data.size, () => {
      wx.hideNavigationBarLoading();
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: this.data.page + 1
    })
    // console.log(this.data.page)
    this.getInvitationArr(this.data.page, this.data.size);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // console.log(app.globalData.scene)
    return {
      title: '老良利珠宝',
      path: 'pages/home/home?scene=' + app.globalData.scene,
      imageUrl: 'https://img.laoliangli.com/label/invitation/share.png'
    }
  }
})