// pages/pay-result/pay-result.js
import { Pay } from 'pay-model.js';
import { Config } from '../../utils/config.js';
import { Alipay } from '../my/set/alipay/alipay-model.js';
var alipay = new Alipay();
var pay = new Pay();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    showPop: false,
    isAddress: false,
    isMessage: false,
    disabled: false,
    payFocus: false,
    isShow: false,
    focus:false,
    shortDisabled: false,
    codename: '获取验证码',
    payMethodId: 1,
    payMethods: '微信支付',
    cpList: [],
    orderCoupon: '',
    passwordValue: '',
    mobileCode: '',
    orderId: null,
    couponId: '',
    checked:false,
    payMethodsArr: [{ payMethodId: 1, payMethods: '微信支付', vip: true }, { payMethodId: 3, payMethods: '钱包支付', subTitle: '（未开通钱包功能，更多功能请前往开通VIP）', targetTitle: '开通VIP', vip: false }]
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var object = JSON.parse(options.jsonStr);
    // 如果商品有优惠卷
    // console.log(object.orderCoupon);
    var offerPrice = '0.00';
    if (object.orderCoupon && object.orderCoupon !== null) {
      offerPrice = object.orderCoupon.offerPrice;
      this.setData({
        orderCoupon: object.orderCoupon.coupon.couponCode,
        couponId: object.orderCoupon.coupon.couponId
      })

    }

    // 商品参数
    this.setData({
      total: object.total,
      offerPrice: offerPrice,
      cpList: object.cpList
    });
    // 地址
    this.getDefaultAddress();
    // 获取商品的优惠卷
    this.getProductCoupon();
    this.getWalletData();
    this.setPhone();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.addressId);
    // 用户添加地址，后返回获取地址
    if (!this.data.isAddress) {
      this.getDefaultAddress();
    }
  },

  // 跳转到地址页
  addressTap:function() {
    wx.navigateTo({
      url: '../my/address/address?addressFlag=1',
    })
  },

  // 添加收货地址
  addAaddressTap:function() {
    wx.navigateTo({
      url: '../my/new-address/new-address',
    })
  },

  // 获取默认地址
  getDefaultAddress:function() {
    var that = this;
    var pay = new Pay();
    pay.getUserDefaultAddress((resAddressData)=>{
      // console.log(resAddressData);
      if (resAddressData) {
        that.setData({
          addressId: resAddressData.id,
          userName: resAddressData.userName,
          userPhone: resAddressData.userPhone,
          province: resAddressData.province,
          city: resAddressData.city,
          area: resAddressData.area,
          address: resAddressData.address,
          isAddress: true
        })
      } else {
        that.setData({
          isAddress: false
        })
      }
    })
  },

  // 获取商品的优惠卷
  getProductCoupon: function() {
    var item = [];
    var cpList = this.data.cpList;

    for (var i = 0; i < cpList.length; i++) {
      item.push({
        pid: cpList[i].pid,
        qty: cpList[i].qty
      })
    }
    // console.log(item);
    pay.getProductCoupon(item, (resData) => {
      // console.log(resData);
      if (resData.length > 0) {
        // 重组优惠卷名称
        // var item = [];
        for (var i = 0; i < resData.length; i++) {
          // resData[i].checked = false;
          if (resData[i].coupon.offer != 0) {
            var offer = resData[i].coupon.offer + '元优惠卷';
            resData[i].couponTitle = offer
            // item.push(offer)
          }
          if (resData[i].coupon.discount != 0) {
            var discount = resData[i].coupon.discount * 10 + '折折扣卷';
            resData[i].couponTitle = discount
            // item.push(discount)
          }
        }
        // console.log(resData);
        // 获取展示可以使用的优惠卷列表
        this.setData({
          couponArr: resData
        })
      }
    })
  },
  // 使用优惠卷,弹框
  orderCouponTap:function() {
    // 获取可使用的优惠卷数组
    var couponArr = this.data.couponArr;
    // console.log(couponArr);
    if (couponArr && couponArr !== '') {
      // 获取当前的优惠卷
      var coupon = this.data.couponId; 
      var c;
      if(coupon === 'none'){
          c = true;
      }else{
        for (var i = 0; i < couponArr.length; i++) {
          // console.log(couponArr[i].coupon.couponCode);
          // console.log(coupon);
          if (couponArr[i].coupon.couponId === coupon) {
            couponArr[i].checked = true
            c = false;
          }
        }
      }

      this.setData({
        couponArr: couponArr,
        checked: c,
        isMessage: false,
        isCoupon: true,
        title: '请选择优惠券'
      })
      this.showModal();
    }
  },
  // 选择使用优惠卷
  checkCouponTap:function(e) {
    var index = e.currentTarget.dataset.index;
    var couponArr = this.data.couponArr;
    // console.log(index);
    // 把所有的优惠卷选中设置为空
    for (var i = 0; i < couponArr.length; i++) {
      couponArr[i].checked = false
    }
    // 把选中当前，设为true
    couponArr[index].checked = true
    var couponCode = couponArr[index].coupon.couponCode;
    var couponId = couponArr[index].coupon.couponId;
    // 获取选中的优惠卷优惠价
    var offerPrice = couponArr[index].offerPrice;
    var total = this.data.total;
    var cuoffer = this.data.offerPrice;
    total += cuoffer;
    total = total - offerPrice;
    // console.log(couponCode);
    // console.log(couponArr);
    this.setData({
      total: total,
      offerPrice: offerPrice,
      couponArr: couponArr,
      orderCoupon: couponCode,
      couponId: couponId,
      checked: false
    })
  },
  // 选择不使用优惠卷按钮
  onCheckCouponTap:function() {
    var couponArr = this.data.couponArr;
    // console.log(index);
    // 其他置空
    for (var i = 0; i < couponArr.length; i++) {
      couponArr[i].checked = false
    }
    var total = this.data.total;
    var cuoffer = this.data.offerPrice;
    total += cuoffer;
    this.setData({
      total: total,
      offerPrice: 0,
      couponArr: couponArr,
      couponId: 'none',
      checked:true
    })
  },

  // 确认优惠卷
  couponConfrimTap:function() {
    this.hideModal();
    this.setData({
      isMessage: false
    })
  },
  // 支付方式弹框
  payMethodsTap:function() {
    this.showModal();
    this.setData({
      isCoupon: false,
      title: '请选择支付方式'
    })
    this.showModal();
  },
  /**
   * 选择支付方式
   */
  payMethodsChecked: function(e) {
    var item = e.currentTarget.dataset.item;
    // console.log(item)
    if (item.vip) {
      this.setData({
        payMethods: item.payMethods,
        payMethodId: item.payMethodId
      })
    } else if (!item.vip && item.targetTitle ==='开通VIP'){
      wx.navigateTo({
        url: '../my/set/reset-password/reset-password?flag=3',
      })
    } else if (!item.vip && item.targetTitle === '请充值') {
      wx.navigateTo({
        url: '../my/wallet/recharge/recharge',
      })
    }
  }, 

  // 点击填写留言
  messageTap:function() {
    this.setData({
      isMessage: true,
    })
  },
  // 留言失焦时，赋值
  bindTextAreaBlur: function (e) {
    this.setData({
      textareaVal: e.detail.value,
    })
    // console.log(this.data.textareaVal);
  },
  // 生成订单并且支付
  clickPayTap: function() {
    // console.log('ddd')
    var that = this;
    var cartList = [];
    var msg; //待获取
    // var payMethodId = 1;
    //获取下单的商品列表集合
    var cpList = this.data.cpList;
    //遍历获取cartList
    for (var i = 0; i < cpList.length; i++) {
      cartList.push({
        id: cpList[i].id,
        pid: cpList[i].pid,
        qty: cpList[i].qty
      })
    }
    // console.log(this.data.textareaVal);

    // 判断地址是否存在
    var addressId = this.data.addressId;
    if (!addressId) {
      wx.showToast({
        title: '还没收货地址哦',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    //组装生成订单对象
    var param = {
      "addressId": addressId,
      "cartList": cartList,
      "msg": this.data.textareaVal,
      "payMethodId": this.data.payMethodId,
      "couponCode": this.data.orderCoupon
    }

    that.setData({
      disabled: true
    })
    var loginToken = wx.getStorageSync('loginToken');
    // console.log(param);
    // return;
    // 请求生成订单
    wx.request({
      url: Config.orderUrl + '/l/v1/order/confirm',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        app.returnCode(res.data.code, res.data.msg);
        if (res.data.code === '200') {
          //生成订单并且返回orderId
          var orderId = res.data.data;
          if (that.data.payMethodId === 1) {
            //通过orderId 去微信支付
            pay.authorizePay(orderId, loginToken, that);
          } else if (that.data.payMethodId === 3) {
            // 钱包支付
            that.setData({
              isShow: true,
              orderId: orderId,
              payFocus: true
            })
          }
        }
      }
    })
  },

  /**
   * 获取钱包信息
   */
  getWalletData: function() {
    pay.walletData((data)=>{
      // console.log(data)
      var payMethodsArr = this.data.payMethodsArr;
      // if (data.code === '212') {
      //   if (item.payMethodId === 2) {
      //     item.vip = false;
      //     item.targetTitle = '开通VIP';
      //   }
      // }
      if (data.code === '200') {
        // console.log(this.data.total);
        payMethodsArr.forEach((item) => {
          if (item.payMethodId === 3 && data.data.amount > this.data.total) {
            item.vip = true;
            item.subTitle = '钱包余额 ￥' + data.data.amount;
          }
          if (item.payMethodId === 3 && data.data.amount < this.data.total) {
            item.vip = false;
            item.subTitle = '钱包余额 ￥' + data.data.amount + ' (余额不足予支付)';
            item.targetTitle = '请充值';
          }
        })
      }
      this.setData({
        payMethodsArr: payMethodsArr
      })
    })
  },
  /**
   * 隐藏输入密码
   */
  closeHiddanTap: function () {
    this.setData({
      isShow: false,
      passwordValue: '',
      payFocus: false
    })
    var flag = 2;
    var payMethodId = 3;
    wx.redirectTo({
      url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + this.data.orderId + '&payMethodId=' + payMethodId + '&total=' + this.data.total,
    })
  },
  /**
   * 获取密码
   */
  getPasswordTap: function (e) {
    var password = e.detail.value
    // console.log(password)
    this.setData({
      passwordValue: password
    })
  },
  /**
   * 获取验证码
   */
  getVerificationCode: function () {
    var that = this;
    var obj = {
      type: 4,
      phone: app.globalData.phone
    };
    // var obj1 = encodeURIComponent(obj);
    // console.log(obj)
    alipay.verificationCode(obj, (res) => {
      // console.log(res)
      that.setData({
        shortDisabled: true
      })
      var num = 61;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          that.setData({
            codename: '重新发送',
            shortDisabled: false
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
   * 支付确认
   */
  formSubmit: function(e) {
    var obj = {
      orderId: this.data.orderId,
      payPassword: e.detail.value.payPassword,
      mobileCode: e.detail.value.code,
      source: 'applets'
    }
    // console.log(obj)
    pay.walletPay(obj, (res) => {
      // console.log(res)
      if (res.code === '803') {
        var flag = 1;
        wx.redirectTo({
          url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + this.data.orderId,
        })
      } else if (res.code === '806') {
        this.setData({
          disabled: false
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
                url: '../my/set/reset-password/reset-password',
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
      } else if (res.code == '203') {
        wx.showToast({
          title: '验证码无效',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          disabled: false
        })
      } else {
        var flag = 2;
        var payMethodId = 3;
        wx.redirectTo({
          url: '../pay/pay-result/pay-result?flag=' + flag + '&orderId=' + this.data.orderId + '&payMethodId=' + payMethodId + '&total=' + this.data.total,
        })
      }
    });
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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