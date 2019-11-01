// pages/my/cash/cash.js
import { Cash } from 'cash-model.js';
var cash = new Cash();
var minAmount = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    showPop: false,
    payFocus: false,
    focus: false,
    disabled: true,
    amount: null,
    minAmount: minAmount,
    tips: '',
    passwordValue: '',
    type: null,
    isShow: false,
    cashData: {},
    // cashMode: {},
    cashMode: [
      { modeImg: 'https://img.laoliangli.com/label/wallet/wx_green_icon.png', payeeName: '微信', account: '' },
      { modeImg: 'https://img.laoliangli.com/label/wallet/alipay_icon.png', payeeName: '支付宝', account: '' },
      { modeImg: 'https://img.laoliangli.com/label/wallet/bank_icon.png', payeeName: '银行卡', account: '' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var amount = parseFloat(options.amount);
    this.getCashData();
    if (amount < minAmount) {
      this.setData({
        tips: '钱包金额不足' + minAmount +'元，无法提取'
      })
    }
    this.setData({
      focus: true,
      amount: amount
    })
    // console.log(this.data.amount)
  },

  /**
   * 获取提现信息
   */
  getCashData: function () {
    // var that = this;
    cash.cashData((resData)=>{
      // console.log(resData)
      if (!resData) {
        var cashData = this.data.cashMode[0]
        this.setData({
          cashData: cashData
        })
      } else {
        var cashData = this.data.cashMode;
        resData.forEach((item)=>{
          if(item.type === 1) {
            // 微信
            var strName = item.payeeName.substr(0, 1) + ' * ' + item.payeeName.substr(item.payeeName.length - 1, 1);
            cashData[0].payeeName = strName;
            var str = item.account.substr(0, 3) + "****" + item.account.substring(item.account.length - 2);
            cashData[0].account = str;
            cashData[0].type = item.type;
          } else if (item.type === 2) {
            // 支付宝
            var strName = item.payeeName.substr(0, 1) + ' * ' + item.payeeName.substr(item.payeeName.length - 1, 1);
            cashData[1].payeeName = strName;
            var str = item.account.substr(0, 3) + "****" + item.account.substr(7);
            // var str = '尾号' + item.account.substring(item.account.length - 4);
            cashData[1].account = str;
            cashData[1].type = item.type;
          } else if (item.type === 3) {
            // 银行卡
            cashData[2].payeeName = item.bank;
            var strAccount = '尾号' + item.account.substring(item.account.length - 4);
            cashData[2].account = strAccount;
            cashData[2].type = item.type;
          }
        })
        // 主页显示提现方式
        var arr = [];
        cashData.forEach((i)=>{
          if (i.type) {
            arr.push(i)
            this.setData({
              cashData: arr[0],
              type: arr[0].type
            })
          }
        })
        this.setData({
          cashMode: cashData
        })
        // console.log(cashData)
      }
    })
  },
  /**
   * 如果默认选择没有绑定，去绑定
   */
  defCashTap: function (e) {
    var account = e.currentTarget.dataset.account;
    // console.log(account)
    if (!account) {
      wx.navigateTo({
        url: '../../set/wxpay/wxpay',
      })
    }
  },

  /**
   * 去更改提现资料
   */
  changeCashTap: function () {
    wx.navigateTo({
      url: '../../set/cash-mode/cash-mode',
    })
  },
  /**
   * 选中提现方式项
   */
  checkModeItem: function (e) {
    var cashData = e.currentTarget.dataset.item
    // console.log(cashData)
    if (cashData.type) {
      this.setData({
        cashData: cashData,
        type: cashData.type
      })
      this.hideModal()
    }
    if (!cashData.type && cashData.payeeName === '微信') {
      wx.navigateTo({
        url: '../../set/wxpay/wxpay',
      })
    } else if (!cashData.type && cashData.payeeName === '支付宝') {
      wx.navigateTo({
        url: '../../set/alipay/alipay',
      })
    } else if (!cashData.type && cashData.payeeName === '银行卡') {
      wx.navigateTo({
        url: '../../set/bank/bank',
      })
    }
  },
  /**
   * 隐藏输入密码
   */
  hiddanTap: function () {
    this.setData({
      isShow: false,
      passwordValue: '',
      payFocus: false
    })
  },
  /**
   * 监听input值
   */
  bindinputTap: function(e) {
    var money = parseFloat(e.detail.value)
    // console.log(money);
    // console.log(this.data.amount);
    if (money >= minAmount) {
      this.setData({
        disabled: false,
        tips: ''
      })
      if (money > this.data.amount) {
        this.setData({
          disabled: true,
          tips: '输入金额超过本次可提现金额'
        })
      }
    } else {
      this.setData({
        disabled: true,
        tips: '输入金额不足' + minAmount +'元，无法提现'
      })
    }
  },
  /**
   * 全部提现
   */
  wholeCashTap: function () {
    var amount = this.data.amount;
    this.setData({
      money: amount
    })
  },

  bindFormSubmit: function (e) {
    /**
     * 判断是否绑定了
     */
    if (!this.data.type) {
      wx.showToast({
        title: '还没绑定该项账号哦',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    /**
     * 验证小数点后长度不能超过2
     */
    var spot = e.detail.value.money.split(".")[1];
    if (spot) {
      var len = spot.length
      if (len > 2) {
        wx.showToast({
          title: '请输入正确的金额',
          icon: 'none',
          duration: 1000
        })
        return false
      }
    }
    var consumAmount = parseFloat(e.detail.value.money);
    // console.log(consumAmount)
    if (consumAmount === 0) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!e.detail.value.money) {
      wx.showToast({
        title: '请输入提现金额，至少' + minAmount +'元',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    var money = Number(e.detail.value.money).toFixed(2);
    if (money < minAmount) {
      wx.showToast({
        title: '提现金额，至少' + minAmount +'元起',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    // console.log(money)
    this.setData({
      account: money,
      isShow: true,
      payFocus: true,
      focus: false
    })
  },

  /**
   * 申请提现
   */
  getCashConfrim: function () {
    var obj = {
      amount: parseFloat(this.data.account),
      type: this.data.type,
      source: 'applets',
      payPassword: this.data.passwordValue
    }
    // console.log(obj)
    cash.cashConfrim(obj, (res) => {
      // console.log(res)
      if (res.data.code === '200') {
        wx.navigateTo({
          url: '../../set/set-result/set-result?consumAmount=' + obj.amount,
        })
        var amount = this.data.amount - obj.amount;
        this.setData({
          isShow: false,
          payFocus: false,
          amount: amount,
          money: '',
          disabled: true
        })
      }
      if (res.data.code === '309') {
        this.setData({
          msg: '提现金额不满足条件'
        })
      }
      if (res.data.code === '806') {
        this.setData({
          msg: '交易密码错误，请重新输入'
        })
        var that = this;
        wx.showModal({
          // title: '支付密码错误，请重试', 
          content: '支付密码错误，请重试',
          showCancel: true,
          cancelText: "忘记密码",
          cancelColor: '#1E1E1E',
          confirmText: "重试",//
          confirmColor: '#E72C2C',
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
              wx.navigateTo({
                url: '../../set/reset-password/reset-password',
              })
            } else {
              // 点击确定
              that.setData({
                isShow: true,
                payFocus: true
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },

  /**
   * 获取密码
   */
  passwordTap: function (e) {
    var password = e.detail.value
    // console.log(password)
    this.setData({
      passwordValue: password
    })
  },
  /**
   * 提现充值弹窗
   */
  cashModeTap: function() {
    this.showModal();
  },
  /**
   * 取消弹窗
   */
  cancelTap:function() {
    this.hideModal()
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

  },
  // 显示底部弹层
  showModal: function () {
    var _this = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
      showPop: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export()
      })
    }.bind(_this), 50)
  },
  // 隐藏底部弹层
  hideModal: function () {
    var _this = this;
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export(),
        showPop: false
      })
    }.bind(this), 200)
  }
})