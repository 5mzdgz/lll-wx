// pages/my/set-result/set-result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    flag: null,
    // setMoney: 100,
    navTitle: '',
    isMode: false,
    isInvitation: false,
    confrim: '完成'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = options.flag
    var money = parseFloat(options.consumAmount)
    // console.log(money)
    if (flag) {
      this.setData({
        flag: flag
      })
    }
    // console.log(this.data.flag)
    this.successData(this.data.flag, money)
  },

  /**
   * 结果统一处理
   */
  successData: function (flag,money) {
    // console.log(money)
    var isMoney = money.toFixed(2);
    if (flag === '1') {
      this.setData({
        navTitle: '设置成功',
        successTitle: '设置成功',
        successSub: '快去前往提现吧！~'
      });
    } else if (flag === '2') {
      this.setData({
        navTitle: '充值成功',
        successTitle: '充值成功',
        successSub: '',
        isMode: true,
        leftName: '充值金额',
        money: money.toFixed(2)
      });
    } else if (flag === '3') {
      this.setData({
        navTitle: '开通成功',
        successTitle: '恭喜您成为老良利VIP',
        successSub: '开始您的分享赚钱之旅吧~',
        isMode: false,
        isInvitation: true,
        confrim: '前往钱包'
      });
      wx.setStorageSync('grade', 1);
    } else if (flag === '4') {
      this.setData({
        navTitle: '设置支付密码成功',
        successTitle: '设置支付密码成功！',
        successSub: '邀请好友有礼或者去购物钱包支付吧~',
        isMode: false,
        isInvitation: true,
        confrim: '前往钱包'
      });
    } else {
      this.setData({
        navTitle: '零钱提现',
        successTitle: '发起申请提现成功',
        successSub: '预计7-15个工作日到账',
        isMode: true,
        leftName: '提现金额',
        money: isMoney
      });
    }
  },
  /**
   * 邀请好友返利页
   */
  invitationTap: function () {
    wx.redirectTo({
      url: '../../invitation/invitation',
    })
  },
  /**
   * 按钮
   */
  confrimTap: function () {
    // if (this.data.flag === '1') {
    //   wx.redirectTo({
    //     url: '../../wallet/wallet',
    //   })
    // } else if (this.data.flag === '2') {
    //   wx.redirectTo({
    //     url: '../../wallet/wallet',
    //   })
    // } else if (this.data.flag === '3') {
    //   wx.redirectTo({
    //     url: '../../wallet/wallet',
    //   })
    // } else {

    // }
    wx.redirectTo({
      url: '../../wallet/wallet',
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