// pages/my/alipay/alipay.js
import { Config } from '../../../../utils/config.js';
import { Alipay } from '../../set/alipay/alipay-model.js';
var alipay = new Alipay();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    codename: '获取验证码',
    disabled: true,
    isDisabled: false
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    if (options.cashData) {
      var cashData = JSON.parse(options.cashData)
    }
    if (cashData) {
      this.setData({
        userName: cashData.payeeName,
        idCard: cashData.account
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
    var phone = wx.getStorageSync('phone');
    var str = phone.substr(0, 3) + "****" + phone.substr(7);
    this.setData({
      sPhone: str
    })
  },

  /**
   * 提交表单
   */
  formSubmit: function (e) {
    var obj = {
      type: 1,
      payeeName: e.detail.value.userName,
      account: e.detail.value.idCard,
      vcode: e.detail.value.code,
      payeePhone: app.globalData.phone
    }
    // 判断持卡人
    if (obj.payeeName === '') {
      wx.showToast({
        title: '持卡人不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 判断持卡人
    if (obj.account === '') {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // var wxreg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
    // if (!wxreg.test(obj.account)) {
    //   wx.showToast({
    //     title: '账号格式不正确',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false;
    // }
    // 判断持卡人
    if (obj.vcode === '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    this.setData({ isDisabled: true });

    alipay.formData(obj, (res) => {
      // console.log(res)
      if (res.data.code === '200') {
        this.setData({ isDisabled: false });
        wx.navigateTo({
          url: '../../set/set-result/set-result?flag=1',
        })
      } else if (res.data.code === '203') {
        wx.showToast({
          title: '验证码无效',
          icon: 'none',
          duration: 1000
        })
        this.setData({ isDisabled: false });
      }
    })
  },

  /**
   * 获取验证码
   */
  getVerificationCode: function () {
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
      var obj = {
        type: 6,
        phone: ph
      };
      // console.log(obj)
      alipay.verificationCode(obj, (res) => {
        // console.log(res)
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
      })
    }
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