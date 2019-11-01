// pages/phone/phone.js
  import { Config } from '../../utils/config.js';


  const app = getApp();

  Page({
    data: {
      showIcon: true,
      phone: '', //手机号
      code: '', //验证码
      codename: '获取验证码'
  },

  onLoad: function () {
  
  },

  number: function () {
    wx.navigateTo({
      url: '../phone/phone'
    })
  },

  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取code
  getCode: function () {
    // console.log(app.globalData.accessToken);
    var ph = this.data.phone;
    var that = this;
    var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(ph)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        data: { type: 1, phone: ph },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'accessToken': app.globalData.accessToken
        },
        url: Config.memberUrl + '/l/v1/user/vcode',
        success(res) {
          // console.log(res)
          //判断 res code 是否等于200 如不是200则发送失败
          //否则 发送成功
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              that.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              that.setData({
                codename: num + "s"
              })
            }
          }, 1000)
        }
      })
    }
  },
  //获取验证码
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },
  //提交表单信息
  save: function () {
    var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        data: {
          type: 1, 
          phone: this.data.phone, 
          vcode: this.data.code, 
          source: 'applets', 
          inviteUser: wx.getStorageSync('scene')
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'accessToken': app.globalData.accessToken
        },
        url: Config.memberUrl + '/l/v1/user/login/reg',
        success(res) {
          // console.log(res)
          if(res.data.code == '200') {
            wx.setStorageSync('loginToken', res.data.data.token);
            // console.log('sss');
            wx.switchTab({
              url: '../my/my',
            })
          //code = 200 登录注册成功 否则失败 或者等于 90001 or 90002 时需要重新获取调用accessToken方法
          //保存 token 到 storage loginToken
          } else if (res.data.code == '90001' || res.data.code == '90002') {
            app.getAccessToken();
          } else if (res.data.code == '203') {
            wx.showToast({
              title: '验证码无效',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    }
  },
  
  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/home/home',
      imageUrl: 'https://img.laoliangli.com/banner/banner-bedfeb9f34684f5ea19ebf15e7440b64.png'
    }
  }
})