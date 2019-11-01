// pages/my/set/reset-password/reset-password.js
import { Config } from '../../../../utils/config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    disabled: true,
    isDisabled: false,
    title: '设置支付密码',
    flag: '',
    sPhone: '',
    phone: '',
    codename: '获取验证码'
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    if (options.flag) {
      var flag = options.flag;
      this.setData({
        flag: flag,
        title: '开通VIP'
      })
    }
    this.setPhone()
    this.setData({
      phone: app.globalData.phone
    })
  },
 
  /**
   * 格式化手机号
   */
  setPhone: function () {
    // var phone = app.globalData.phone;
    var phone = wx.getStorageSync('phone');
    var str = phone.substr(0, 3) + "****" + phone.substr(7);
    this.setData({
      sPhone: str
    })
  },
  /**
   * 获取验证码
   */
  getVerificationCode: function () {
    // console.log(app.globalData.accessToken);
    var ph = this.data.phone;
    var that = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
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
        data: { type: 3, phone: ph },
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
  /**
   * 提交表单
   */
  formSubmit: function(e) {
    var confrimPassword = e.detail.value.confrimPassword
    var checkPassword = /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/
    var obj = {
      type: 3,
      phone: this.data.phone,
      vcode: e.detail.value.code,
      password: e.detail.value.password,

    }
    if (obj.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (obj.password !== confrimPassword) {
      wx.showToast({
        title: '密码不一至',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (obj.password.length < 6) {
      wx.showToast({
        title: '密码不能小于6位',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!obj.password.match(checkPassword)) {
      wx.showToast({
        title: '密码格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    this.setData({ isDisabled: true });
    this.openVip(obj);
  },
  /**
   * 请求
   */
  openVip: function (obj) {
    var that = this;
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/vcode/update/pay/password',
      method: 'POST',
      data: obj,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken,
      },
      success: function (res) {
        var resData = res.data.data
        // console.log(res);
        if (res.data.code === '200') {
          that.setData({
            isDisabled: false,
            code: '',
            password: '',
            confrimPassword: ''
          });
          if (that.data.flag==='3') {
            wx.navigateTo({
              url: '../../set/set-result/set-result?flag=3',
            })
          } else {
            wx.navigateTo({
              url: '../../set/set-result/set-result?flag=4',
            })
          }
        } else if (res.data.code === '203') {
          that.setData({ isDisabled: false });
          wx.showToast({
            title: '验证码无效',
            icon: 'none',
            duration: 1000
          })
        }
        app.returnCode(res.data.code, res.data.msg);
      }
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
    // this.setPhone()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})