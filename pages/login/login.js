//index.js
//获取应用实例
import { Config } from '../../utils/config.js';

const app = getApp();


Page({
  data: {
    showIcon: true,
    closeLogin: true
  },

  number:function() {
    wx.navigateTo({
      url: '../phone/phone',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          // that.setData({
          //   isHide: true
          // });
        }
      }
    })
  },
  bindGetUserInfo(res) {
    var that = this;
    //console.log(JSON.stringify(res));
    if (res.detail.userInfo) {
      //console.log("点击了同意授权");
      app.globalData.userInfo = res.detail.userInfo
      wx.login({
        success: function (e) {
          // console.log(e);
          if (e.code) {
            wx.request({
             url: Config.memberUrl + '/l/v1/third/user/decrypt/user/info?code=' + e.code,
              method: 'POST',
              data: {
                nickname: encodeURIComponent(res.detail.userInfo.nickName),
                sex: res.detail.userInfo.gender,
                province: res.detail.userInfo.province,
                city: res.detail.userInfo.city,
                country: res.detail.userInfo.country,        
                headimgurl: res.detail.userInfo.avatarUrl,
              },
              header: {
                'content-type': 'application/json', 
                'accessToken': app.globalData.accessToken
              },
              success: function (e) {
               // console.log(e2);
                if(!e.data.data.isPhoneBind){
                  //当现实未绑定手机时，提示绑定手机
                 //获取手机号绑定授权校验 
                 //进行微信授权弹框 授权绑定手机号
                  // console.log('获取手机号绑定授权校验');
                  that.setData({
                    closeLogin: false
                  });
                }else{
                  wx.setStorageSync('loginToken', e.data.data.token);
                  // console.log(JSON.stringify(e.data.data));
                  // wx.setStorageSync('userName', e.data.data.user.nickname);
                  // wx.setStorageSync('headImgUrl', e.data.data.user.headImgUrl);
                  // wx.setStorageSync('autograph', e.data.data.user.autograph);
                  wx.switchTab({
                    url: '../my/my',
                  });
                }
               
              }
            })
          } else {
            // console.log("授权失败");
          }
        }
      })
    } else {
      // console.log("点击了拒绝授权");
    }
  }, 
  getPhoneNumber: function (e) {
    var that = this;
    wx.login({
      success: res => {
        // console.log(res.code);
        wx.request({
          url: Config.memberUrl + '/l/v1/third/user/decrypt/tel',
          data: {
            'encryptedData': e.detail.encryptedData,
            'iv': e.detail.iv,
            'code': res.code,
            'inviteUser': wx.getStorageSync('scene')
          },
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'accessToken': app.globalData.accessToken
          }, // 设置请求的 header
          success: function (res) {
            if (res.data.code === '200') {
              // console.log(res.data);
              wx.setStorageSync('loginToken',res.data.data.token);
              // wx.setStorageSync('userName', res.data.data.user.nickname);
              // wx.setStorageSync('userHeadImg', res.data.data.user.headImgUrl);
              //wx.setStorageSync('userInfo', res.data.data.user);
              wx.switchTab({
                url: '../my/my',
              });
            }
          },
          fail: function (err) {
            // console.log(err);
          }
        })
      }
    })
  },

  refuse:function(){
    this.setData({
      closeLogin: true
    });
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
