// pages/my/cash-mode/cash-mode.js
import { Cash } from '../../wallet/cash/cash-model.js';
import { buttonClicked } from '../../../../utils/util.js';
var cash = new Cash();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    buttonClicked: false,
    // cashArr:[],
    cashMode: [
      { id: 1, modeImg: 'https://img.laoliangli.com/label/wallet/wx_green_icon.png', modeName: '微信', payeeName: '微信', account: '' },
      { id: 2, modeImg: 'https://img.laoliangli.com/label/wallet/alipay_icon.png', modeName: '支付宝', payeeName: '支付宝', account: '' },
      { id: 3, modeImg: 'https://img.laoliangli.com/label/wallet/bank_icon.png', modeName: '银行卡', payeeName: '银行卡', account: '' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCashData();
  },

  /**
   * 获取提现信息
   */
  getCashData: function () {
    // var that = this;
    cash.cashData((resData) => {
      // console.log(resData)
        // this.setData({
        //   cashArr: resData
        // })
        var cashData = this.data.cashMode;
        if (resData) {
          resData.forEach((item) => {
            if (item.type === 1) {
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
              cashData[1].account = str;
              cashData[1].type = item.type;
            } else if (item.type === 3) {
              // 银行卡
              // console.log(item.bank)
              cashData[2].payeeName = item.bank;
              var strAccount = '尾号' + item.account.substring(item.account.length - 4);
              cashData[2].account = strAccount;
              cashData[2].type = item.type;
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
   * 去绑定
   */
  checkMode: function (e) {
    buttonClicked(this);
    var cashData = e.currentTarget.dataset.item
    // console.log(cashData)
    if (cashData.id === 3) {
      // console.log('22')
      if (cashData.type) {
        // console.log('33')
        // console.log(this.data.cashMode)
        this.data.cashMode.forEach((item)=>{
          // console.log('44')
          if(item.type===cashData.type) {
            // console.log('sss')
            wx.navigateTo({
              url: '../../set/bank/bank?cashData=' + JSON.stringify(item),
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../../set/bank/bank',
        })
      }
    } else if (cashData.id === 2) {
      if (cashData.type) {
        this.data.cashMode.forEach((item) => {
          if (item.type === cashData.type) {
            wx.navigateTo({
              url: '../../set/alipay/alipay?cashData=' + JSON.stringify(item),
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../../set/alipay/alipay',
        })
      }
    } else if (cashData.id === 1) {
      if (cashData.type) {
        this.data.cashMode.forEach((item) => {
          if (item.type === cashData.type) {
            wx.navigateTo({
              url: '../../set/wxpay/wxpay?cashData=' + JSON.stringify(item),
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../../set/wxpay/wxpay',
        })
      }
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