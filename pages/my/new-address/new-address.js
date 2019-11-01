// pages/my/address/new-address/new-address.js
import { Config } from '../../../utils/config.js';
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    titleTabbar: '编辑地址',
    region: ['省份', '城市', '区/县'],
    checked: false,
    isDefault: 0
    // customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面显示
   * id存在时
   */
  onLoad: function (options) {
    if(options.id) {
      var id = options.id;
      // console.log(id);
      this.data.id = id;
      this.getIdAddressInfo(this.data.id);
    }
  },

  // 获取id存在，获取用户地址信息
  getIdAddressInfo:function(id) {
    var that = this;
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/address/get?id=' + id,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken,
      },
      success: function (res) {
        var resData = res.data.data
        // console.log(res);
        if (res.data.code === '200') {
          if (resData.isDefault === 1) {
            that.setData({
              checked: true
            })
          }
          that.setData({
            userName: resData.userName,
            userPhone: resData.userPhone,
            region: [resData.province, resData.city, resData.area],
            address: resData.address,
            postCode: resData.postCode,
            isDefault: resData.isDefault
          })
        }
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  },

  // 地址联动选择
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 地图中选地址
  chooseLocationTap:function() {
    var that = this;
    
    wx.chooseLocation({
      success: function (res) {
        // console.log(res);
        if (res.address) {
          var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
          var REGION_PROVINCE = [];
          var addressBean = {
            REGION_PROVINCE: null,
            REGION_COUNTRY: null,
            REGION_CITY: null,
            ADDRESS: null
          };
          function regexAddressBean(address, addressBean) {
            regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
            var addxress = regex.exec(address);
            addressBean.REGION_CITY = addxress[1];
            addressBean.REGION_COUNTRY = addxress[2];
            // addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
            addressBean.ADDRESS = addxress[3] + res.name;
          }
          if (!(REGION_PROVINCE = regex.exec(res.address))) {
            regex = /^(.*?(省|自治区))(.*?)$/;
            REGION_PROVINCE = regex.exec(res.address);
            // console.log(REGION_PROVINCE);
            if (REGION_PROVINCE!=null) {
              addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
              regexAddressBean(REGION_PROVINCE[3], addressBean);
            } else {
              wx.showToast({
                title: '请选择完整地址信息选项',
                icon: 'none'
              })
            }
          } else {
            addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
            regexAddressBean(res.address, addressBean);
          }
          if (REGION_PROVINCE != null) {
            that.setData({
              // ADDRESS_1_STR:
              //   addressBean.REGION_PROVINCE + " "
              //   + addressBean.REGION_CITY + ""
              //   + addressBean.REGION_COUNTRY
              region: [addressBean.REGION_PROVINCE, addressBean.REGION_CITY, addressBean.REGION_COUNTRY],
              address: addressBean.ADDRESS,
            });
            // that.setData(addressBean); 
          }
        } else {
          wx.showToast({
            title: '请选择完整地址信息选项',
            icon: 'none'
          })
        }
      },
      fail: function (e) {
        // console.log(e)
        that.getLocation()
      },
      cancel:function(e) {
        // console.log(e)
      }
    });  
  },

  getLocation: function () {
    let _this = this;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _this.chooseLocation();
            },
            fail(errMsg) {
              // wx.showToast({ title: JSON.stringify(errMsg), icon: 'none' })
              // console.log(errMsg)
              wx.openSetting({
                success:function(res) {
                  // console.log(res)
                }
              })
            }
          })
        } else {
          // _this.chooseLocation();
        }
      }
    })
  },

  // 设置默认地址
  switchChange: function (e) {
    // console.log('switch 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value == true) {
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 0
      })
    }
  },

  // 提交用户地址表单
  formSubmit:function(e) {
    
    var that = this;
    var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    var obj = {
      userName: e.detail.value.userName,
      userPhone: e.detail.value.userPhone,
      country: '中国',
      province: this.data.region[0],
      city: this.data.region[1],
      area: this.data.region[2],
      address: e.detail.value.address,
      postCode: e.detail.value.zip,
      isDefault: this.data.isDefault
    };
    // 判断联系人
    if (obj.userName === '') {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 验证手机号码格式
    if (obj.userPhone === '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(obj.userPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false; 
    }
    //  验证选择地区
    if (obj.province === '省份') {
      wx.showToast({
        title: '选择地区不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    //  验证详细地址
    if (obj.address === '') {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // console.log(obj);
    var loginToken = wx.getStorageSync('loginToken');
    var aUrl;
    if(this.data.id) {
      // console.log(this.data.id)
      var key = 'id';
      var value = this.data.id;
      obj[key] = value;
      // console.log(obj)
      aUrl = Config.memberUrl + '/l/v1/user/address/update';
    } else {
      aUrl = Config.memberUrl + '/l/v1/user/address/add';
    }
    wx.request({
      url: aUrl,
      data: obj,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken,
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code === '200') {
          wx.navigateBack({
            delta: 1
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