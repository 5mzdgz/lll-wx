// pages/my/bank/bank.js
import { bankCardValidate, IdCardValidate } from '../../../../utils/util.js';
import { bankCardAttribution } from '../../../../utils/bankSku.js';
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
    showPop: false,
    isShowIcon: 0,
    cardlen: 0,
    disabled: false,
    codename: '获取验证码',
    bankName: '请选择',
    bankTitle: ["中国邮政储蓄银行", "中国工商银行", "中国农业银行", "中国银行", "中国建设银行", "中国交通银行", "招商银行", "中国民生银行", "中国光大银行", "中信银行", "华夏银行", "深发/平安银行", "兴业银行", "上海银行", "浦东发展银行", "广发银行", "渤海银行", "广州银行", "金华银行", "温州银行", "徽商银行", "江苏银行", "南京银行", "宁波银行", "北京银行", "北京农村商业银行", "汇丰银行", "渣打银行", "花旗银行", "东亚银行", "广东华兴银行", "深圳农村商业银行", "广州农村商业银行股份有限公司", "东莞农村商业银行", "东莞市商业银行", "广东省农村信用社联合社", "大新银行", "永亨银行", "星展银行香港有限公司", "恒丰银行", "天津市商业银行", "浙商银行", "南洋商业银行", "厦门银行", "福建海峡银行", "吉林银行", "汉口银行", "盛京银行", "大连银行", "河北银行", "乌鲁木齐市商业银行", "绍兴银行", "成都商业银行", "抚顺银行", "郑州银行", "宁夏银行", "重庆银行", "哈尔滨银行", "兰州银行", "青岛银行", "秦皇岛市商业银行", "青海银行", "台州银行", "长沙银行", "泉州银行", "包商银行", "龙江银行", "上海农商银行", "浙江泰隆商业银行", "内蒙古银行", "广西北部湾银行", "桂林银行", "龙江银行", "成都农村商业银行", "福建省农村信用社联合社", "天津农村商业银行", "江苏省农村信用社联合社", "湖南农村信用社联合社", "江西省农村信用社联合社", "商丘市商业银行", "华融湘江银行", "衡水市商业银行", "重庆南川石银村镇银行", "湖南省农村信用社联合社", "邢台银行", "临汾市尧都区农村信用合作联社", "东营银行", "上饶银行", "德州银行", "承德银行", "云南省农村信用社", "柳州银行", "威海市商业银行", "湖州银行", "潍坊银行", "赣州银行", "日照银行", "南昌银行", "贵阳银行", "锦州银行", "齐商银行", "珠海华润银行", "葫芦岛市商业银行", "宜昌市商业银行", "杭州商业银行", "苏州市商业银行", "辽阳银行", "洛阳银行", "焦作市商业银行", "镇江市商业银行", "法国兴业银行", "大华银行", "企业银行", "华侨银行", "恒生银行", "临沂商业银行", "烟台商业银行", "齐鲁银行", "BC卡公司", "集友银行", "大丰银行", "AEON信贷财务亚洲有限公司", "澳门BDA"]
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
        idCard: cashData.cardNo,
        bankName: cashData.bank,
        bankCard: cashData.account.replace(/(\d{4})(?=\d)/g, "$1 ")
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
   * 银行账号格式化
   */
  bankCardTap:function(e) {
    var card = e.detail.value;
    var len = card.length 
    //判断用户是输入还是回删
    if (len > this.data.cardlen) {
      // 用户输入
      if ((len + 1) % 5 == 0) {
        card = card + ' '
      }
    } else {
      //用户回删
      card = card.replace(/(^\s*)|(\s*$)/g, "")
    }
    //将处理后的值赋予到输入框
    this.setData({
      bankCard: card
    })
    //将每次用户输入的卡号长度赋予到长度中转站
    this.setData({
      cardlen: len
    })
  },
  
  /**
   * 提交表单
   */
  formSubmit:function (e) {
    var str = e.detail.value.bankCard;
    // 银行账号去掉空格
    var bankCard = str.replace(/\s*/g, "");
    /**
     * 获取银行名称
     */
    // var bankObj = bankCardAttribution(bankCard);
    // console.log(bankObj.bankName);
    var obj = {
      type: 3,
      payeeName: e.detail.value.userName,
      cardNo: e.detail.value.idCard,
      account: bankCard,
      bank: this.data.bankName,
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
    // 身份证验证
    var idCard = IdCardValidate(obj.cardNo)
    if (!idCard) {
      wx.showToast({
        title: '请使用有效的身份证件',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 银行账号验证
    var bankCard = bankCardValidate(obj.account)
    if (!bankCard) {
      wx.showToast({
        title: '请使用有效的储蓄卡',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // console.log(obj.cardNo)
    // console.log(obj.account)
    // 银行名称有无
    if (obj.bank === '请选择') {
      wx.showToast({
        title: '没有选中银行卡哦',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (obj.payeePhone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(obj.payeePhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // console.log(obj)
    this.setData({ disabled: true });
    alipay.formData(obj, (res)=>{
      // console.log(res)
      if (res.data.code === '200') {
        this.setData({ disabled: false });
        wx.navigateTo({
          url: '../../set/set-result/set-result?flag=1',
        })
      } else if (res.data.code == '203') {
        this.setData({ disabled: false });
        wx.showToast({
          title: '验证码无效',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  /**
   * 获取验证码
   */
  getVerificationCode: function () {
    var that = this;
    var obj = {
      type: 6,
      phone: app.globalData.phone
    };
    // var obj1 = encodeURIComponent(obj);
    // console.log(obj1)
    alipay.verificationCode(encodeURIComponent(obj), (res) => {
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
  },
   /**
    * 选择银行
    */
  checkBankTap:function (e) {
    var item = e.currentTarget.dataset.item
    // console.log(index)
    this.setData({
      bankName: item
    })
    this.hideModal()
  },

  // bindPickerChange: function(e) {
    // var bank = this.data.bankTitle[e.detail.value]
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    // console.log(bank)
  //   this.setData({
  //     bankName: bank
  //   })
  // },
  /**
   * 提现充值弹窗
   */
  cashModeTap: function () {
    this.showModal();
  },
  /**
   * 取消弹窗
   */
  cancelTap: function () {
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