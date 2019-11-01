// pages/my/maintain/maintain.js
import { Maintain } from 'maintain-model.js';
var maintain = new Maintain();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true,
    isContacts: true,
    isMaterial: false,
    isMaintain: false,
    isCategory: false,
    disabled: true,
    isDisabled: true,
    btnContacts: false,
    isClause: false,
    isServiceDetail: false,
    btnDisabled: true,
    focus: true,
    isMsg: false,
    textFocus: false,
    btnPhone: 0,
    current: -1,
    totalPrice: 0,
    maintainData: {},
    count: 0,
    checkedArr: [],
    msg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMaintainArr();
    // this.getHeigth();
    var loginToken = wx.getStorageSync('loginToken');
    if (!loginToken) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var phone = wx.getStorageSync('maintainPhone');
    var contacts = wx.getStorageSync('maintainContacts');
    if (phone && contacts) {
      this.setData({
        phone: phone,
        contacts: contacts,
        btnPhone: 11,
        isDisabled: false,
        btnContacts: true
      })
    }
  },
  /**
   * 获取容器的高度
   */
  getHeigth: function() {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.maintain-item-box').boundingClientRect(function (rect) {
      // console.log(rect.width / 1.5)
      that.setData({
        height: rect.width/1.5 + 'px'
      })
    }).exec();
  },
  /**
   * 获取保养服务数据
   */
  getMaintainArr: function() {
    maintain.maintainArr((resData) => {
      console.log(resData);
      // 排序
      resData.sort(function (a, b) {
        return a.id - b.id
      })
      
      this.setData({
        materialArr: resData
      })
    })
  },
  /**
   * 联系人
   */
  bindContactsInput: function(e) {
    var len = e.detail.value.length;
    // console.log(len);
    if (len > 0) {
      this.setData({
        btnContacts: true
      })
    }
    var phoneLen = this.data.btnPhone;
    // console.log(phoneLen)
    if (len > 0 && phoneLen == 11) {
      this.setData({
        isDisabled: false
      })
    } else {
      this.setData({
        isDisabled: true
      })
    }
  },
  /**
   * 手机号
   */
  bindPhoneInput: function(e) {
    var len = e.detail.value.length;
    var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    // console.log(this.data.btnContacts);
    // console.log(len);
    if (len == 11) {
      this.setData({
        btnPhone: 11
      })
    }
    if (len == 11 && this.data.btnContacts) {
      this.setData({
        isDisabled: false
      })
    } else {
      this.setData({
        isDisabled: true
      })
    }
  },
  /**
   * 获取联系人信息
   */
  bindsubmit: function (e) {
    var contacts = e.detail.value.contacts;
    var phone = e.detail.value.phone;
    // console.log(contacts);
    // console.log(phone);
    if (contacts === '') {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (phone === '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    wx.setStorageSync('maintainPhone', phone);
    wx.setStorageSync('maintainContacts', contacts);

    this.setData({
      contacts: contacts,
      phone: phone,
      isContacts: false,
      focus: false,
      isMaterial: true
    })
  },
  /**
   * 显示修改联系人信息
   */
  showContactsTap: function() {
    if (this.data.isContacts) {
      this.setData({
        isContacts: false
      })
    } else {
      this.setData({
        isContacts: true
      })
    }
  },
  /**
   *显示下拉材质
   */
  showMaterialTap:function () {
    
    if (this.data.isMaterial) {
      // this.hideModal();
      this.setData({
        isMaterial: false,
        isMaintain: true,
      })
      // this.getHeigth();
    } else {
      // this.getHeigth();
      // this.showModal();
      this.setData({
        isContacts: false,
        isMaterial: true,
        isMaintain: false,
        isCategory: false
      })
    }
  },

  /**
   * 选择材质
   */
  checkedMaterial:function (e) {
    var index = e.currentTarget.dataset.index;
    // console.log(index)
    var materialArr = this.data.materialArr;
    // var len = materialArr[index].matCategorys.length;
    var matId = materialArr[index].id;
    wx.setStorageSync('matId', matId);
    var isMoreMat = materialArr[index].isMoreMat;
    var categoryArr = materialArr[index].matCategorys;
    var maintainArr = materialArr[index].msmList;
    var nowPrice = 0;
    for (var i in maintainArr) {
      // var estimate = maintainArr[i].estimate;
      // if (estimate) {
      //   maintainArr[i].nowPrice = 0;
      //   maintainArr[i].servicePrice = 0;
      // }
      var msomListItem = maintainArr[i].msomList;
      if (msomListItem.length > 0) {
        for (var j in msomListItem) {
          var timestamp = new Date().getTime();
          // var stime = Date.parse(new Date(msomListItem[j].startTime));
          // var etime = Date.parse(new Date(msomListItem[j].endTime));
          var stime = new Date(msomListItem[j].startTime.replace(/\-/g, '/')).getTime();
          var etime = new Date(msomListItem[j].endTime.replace(/\-/g, '/')).getTime();
          // console.log(etime);
          // 时间范围
          if (timestamp > stime && timestamp < etime) {
            nowPrice = msomListItem[j].offerPrice;
          } else {
            nowPrice = maintainArr[i].servicePrice;
          }
          maintainArr[i].nowPrice = nowPrice;
          maintainArr[i].qty = 1;
        }
      } else {
        nowPrice = maintainArr[i].servicePrice;
        maintainArr[i].nowPrice = nowPrice;
        maintainArr[i].qty = 1;
      }
      // 置空当前选中
      if (maintainArr[i].checked) {
        maintainArr[i].checked = false;
      }
    }

    this.setData({
      isMoreMat: isMoreMat,
      categoryArr: categoryArr,
      isCategory: false,
      isMaintain: true,
      current: index,
      material: materialArr[index].matName,
      maintainArr: maintainArr,
      nowPrice: nowPrice,
      disabled: true,
      categoryCurrent: -1,
      matCategory: null
    })

    if (index === 2) {
      this.setData({
        isMaintain: false,
        isCategory: true
      })
    }
    
    this.checkTotals();
  },
  /**
   * 显示材质类别
   */
  showMaterialCategoryTap: function () {
    if (this.data.isCategory) {
      this.setData({ isCategory: false })
    } else {
      this.setData({
        isCategory: true,
        isMaterial: false
      })
    }
  },
  /**
   * 选择材质类别
   */
  checkedCategoryTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var categoryArr = this.data.categoryArr;
    var matCategory = categoryArr[index];
    // console.log(index);
    this.setData({
      isMaintain: true,
      matCategory: matCategory,
      categoryCurrent: index
    })
  },

  /**
   * 显示保养项目
   */

  showMaintainTap: function () {
    if (this.data.isMaintain) {
      this.setData({ isMaintain: false });
    } else {
      this.setData({
        isMaterial: false,
        isMaintain: true
      })
    }
  },

  /**
   * 选中保养项目
   */

  checkedMaintain: function(e) {
    var maintainArr = this.data.maintainArr;
    var id = e.currentTarget.dataset.id;
    // var count = 0;
    // console.log(id);
    var checkedArr = this.data.checkedArr;
    var estimate = false;
    for (var i = 0; i < maintainArr.length; i++) {
      if (maintainArr[i].sid == id) {
        if (maintainArr[i].checked) {
          maintainArr[i].checked = false;
          // 删除选中项数组sid相同的项
          checkedArr.forEach((item,index) => {
            if (checkedArr[index].sid === maintainArr[i].sid) {
              checkedArr.splice(index, 1);
            }
          })
          // count计数，拥于控制预约下单button禁用与解除
          this.data.count--
        } else {
          maintainArr[i].checked = true;
          this.data.count++
          checkedArr.push(maintainArr[i]);
        }
      }
    }
    // console.log(this.data.count);
    if (this.data.count <= 0) {
      this.setData({ disabled: true });
    } else {
      this.setData({ disabled: false });
    }
    // 只要选中待评估的项，预估费用为待评估
    for (var key in checkedArr) {
      if (checkedArr[key].estimate && checkedArr[key].checked) {
        estimate = true;
      }
    }
    // console.log(checkedArr)
    this.setData({
      estimate: estimate,
      maintainArr: maintainArr
    });
    this.checkTotals();
  },

  /**
   * 减少商品数量
   */
  onReduceNum: function (e) {
    var index = e.currentTarget.dataset.index;
    var maintainArr = this.data.maintainArr;
    // console.log(index)
    var qty = maintainArr[index].qty;
    if (qty <= 1) {
      return;
    } else {
      maintainArr[index].qty--;
      this.setData({
        maintainArr: maintainArr
      });
    }
    this.checkTotals();
  },
  /**
   * 增加商品数量
   */
  onAddNum: function (e) {
    var index = e.currentTarget.dataset.index;

    var maintainArr = this.data.maintainArr;
    // console.log(index)
    maintainArr[index].qty++;
    this.setData({
      maintainArr: maintainArr
    });
    this.checkTotals();
  },
  /**
   * 计算
   */
  checkTotals: function () {
    var totalCount = 0;
    var totalPrice = 0;
    var maintainArr = this.data.maintainArr

    for (var i = 0; i < maintainArr.length; i++) {
      var carData = maintainArr[i];
      if (carData.checked) {
        // console.log(carData.nowPrice);
        totalCount += carData.qty;
        totalPrice += carData.qty * carData.nowPrice;
      }
    }
    // js浮点运算bug，需toFixed()
    totalPrice = totalPrice.toFixed(2);
    this.setData({
      totalPrice: totalPrice,
    })
  },
  /**
   * 显示备注栏
   */
  orderMsgTap: function() {
    this.setData({ 
      isMsg: true,
      textFocus: true,
      textMsg: this.data.msg
    })
  },
  /**
   * 获取订单备注
   */
  msgSubmit: function(e) {
    var msg = e.detail.value.msg;
    // console.log(msg)
    this.setData({
      msg: msg,
      isMsg: false
    })
  },
  /**
   * 预约下单
   */
  confrimOrderTap: function () {
    var msList = [];
    var maintainArr = this.data.maintainArr;
    maintainArr.forEach((item) => {
      if (item.checked) {
        msList.push({
          serviceId: item.sid,
          qty: item.qty
        })
        // console.log(msList);
      }
    })

    var obj = {
      callName: this.data.contacts,
      callPhone: this.data.phone,
      matId: wx.getStorageSync('matId'),
      matCategory: this.data.matCategory,
      source: 'applets',
      msList: msList,
      userMsg: this.data.msg
    };

    if (!obj.callName && !obj.callPhone) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    
    this.setData({
      isClause: true,
      checked: false,
      maintainData: obj
    })
  },
  /**
   * 勾选
   */
  checkboxChange: function (e) {
    // console.log(e.detail.value)
    var len = e.detail.value.length;
    if (len > 0) {
      this.setData({ btnDisabled: false })
    } else {
      this.setData({ btnDisabled: true })
    }
  },
  /**
   * 服务条款滚动底部
   */
  bindscrolltolowerTap: function (e) {
    // console.log(e)
    // this.setData({
    //   checked: true,
    //   btnDisabled: false
    // })
  },
  /**
   * 取消按钮
   */
  cancelTap: function () {
    this.setData({
      isClause: false,
      btnDisabled: true,
      checked: false,
      isServiceDetail: false
    })
  },

  /**
   * 同意并提交
   */
  confrimSaveTap: function () {
    maintain.postMaintain(this.data.maintainData, (resData) => {
      // console.log(this.data.maintainData)
      // console.log(resData)
      if (resData.code === '200') {
        var orderId = resData.data.orderId;
        var orderNumber = resData.data.orderNumber;

        wx.navigateTo({
          url: '../maintain/photograph/photograph?orderId=' + orderId + '&orderNumber=' + orderNumber,
        })

        this.setData({
          isContacts: true,
          isMaterial: false,
          isMaintain: false,
          isCategory: false,
          disabled: true,
          isDisabled: false,
          btnContacts: false,
          isClause: false,
          btnDisabled: true,
          focus: false,
          current: -1,
          totalPrice: 0,
          maintainData: {},
          count: 0,
          material: null,
          isMoreMat: false,
          matCategory: null,
          maintainArr: []
        })
      }
    })
  },

  /**
   * 保养项详情
   */
  serviceDetailTap: function(e) {
    var item = e.currentTarget.dataset.item;
    // console.log(item);
    this.setData({
      serviceName: item.serviceName,
      serviceRemark: item.serviceRemark,
      isServiceDetail: true
    });
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
    return {
      title: '首饰保养',
      path: 'pages/my/maintain/maintain',
      imageUrl: 'https://img.laoliangli.com/label/maintain/maintain_share.png'
    }
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
    animation.translateY(-430).step()
    _this.setData({
      animationData: animation.export(),
      isMaterial: true
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
    animation.translateY(-430).step()
    _this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export(),
        isMaterial: false
      })
    }.bind(this), 200)
  }
})