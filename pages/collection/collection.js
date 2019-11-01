// pages/collection/collection.js
import { Collection } from 'collection-model.js';
import { Car } from '../car/car-model.js';
var car = new Car();
var collection = new Collection();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    page: 1,
    size: 5,
    number: 0,
    listTotailPirce: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCollectionArr(this.data.page, this.data.size);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCollectionArr(this.data.page, this.data.size);
    this.resetCheckbox();
  },

  //收藏列表
  getCollectionArr: function (page, size) {
    collection.getCollectionList(page, size, (res) => {
      var resData = res.data.data;
      if (page > 1) {
        var collectionArr = this.data.collectionArr;
        if (resData && resData.length > 0) {
          this.collectHandle(resData);
          resData.forEach((item) => {
            collectionArr.push(item);
          });
        }
      } else {
        if (resData && resData.length > 0) {
          this.collectHandle(resData);
        }
        var collectionArr = resData;
      }
      
      if (res.code == '207') {
        wx.hideLoading();
      }
      wx.hideLoading();
      this.setData({
        collectionArr: collectionArr,
        loadingHidden: true
      })
    })
  },
  /**
   * 数据处理
   */
  collectHandle: function(resData) {
    for (var i = 0; i < resData.length; i++) {
      var str = resData[i].collectDate;
      //日期转换
      var oDate = new Date(str),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate();
      var oTime = this.getzf(oMonth) + '月' + this.getzf(oDay) + '日';
      resData[i].oTime = oTime;
    }
  },
  //补0操作  
  getzf:function(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  //计算
  checkTotals: function () {
    var number = 0;// 商品件数
    var listTotailPirce = 0; // 价格合计
    var collectionArr = this.data.collectionArr
    for (var i = 0; i < collectionArr.length; i++) {
      var collectionData = collectionArr[i];
      if (collectionData.checked) {
        number += 1;
        listTotailPirce += collectionData.nowPrice;
      }
    }
    listTotailPirce = listTotailPirce.toFixed(2);

    this.setData({
      number: number,
      listTotailPirce: listTotailPirce
    })
  },

  //用户选中商品
  checkboxChange: function (e) {
    var checkboxItems = this.data.collectionArr;
    var values = e.detail.value;
    for (var i = 0; i < checkboxItems.length; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0; j < values.length; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      collectionArr: checkboxItems
    });
    this.checkTotals();
  },

  //取消收藏
  collectionTap:function(e) {
    var that = this;
    var id = e.target.dataset.id;
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    wx.showModal({
      title: '取消收藏',
      content: '确定取消收藏该商品？',
      showCancel: true,
      cancelText: "否",
      cancelColor: '#777',
      confirmText: "是",//
      confirmColor: '#E72C2C',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          // 点击确定
          collection.delCollection(id, (resData) => {
            // console.log(resData)
            if (resData.data.code == '200') {
              that.getCollectionArr(1, that.data.size);
            }
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 跳转详情
  detailTap:function(e) {
    var id = e.target.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },
  // 选择合并支付
  totalPayTap:function() {
    var checkboxItems = this.data.collectionArr.filter((item) => {
      return item.checked == true
    });
    var arr = [];
    if (checkboxItems.length > 0) {
      for(var i = 0; i < checkboxItems.length; i++) {
        arr.push({
          pid: checkboxItems[i].id,
          qty: 1
        })
      }
      // console.log(arr);
    }

    car.goPayOrder(arr, (resData) => {
      // console.log(resData.data.data);
      var str = JSON.stringify(resData.data.data)
      wx.navigateTo({
        url: '../pay/pay?jsonStr=' + str,
      })
    })
  },

  // 未下单返回收藏页面刷新并重置单选
  resetCheckbox: function () {
    var checkboxItems = this.data.collectionArr;
    // console.log(checkboxItems);
    if (checkboxItems) {
      for (var i = 0; i < checkboxItems.length; ++i) {
        if (checkboxItems[i].checked == true) {
          checkboxItems[i].checked = false;
          // break;
        }
      }

      this.setData({
        collectionArr: []
      });
      // console.log(checkboxItems);
      this.checkTotals();
    }
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
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    this.getCollectionArr(this.data.page, this.data.size, () => {
      wx.hideNavigationBarLoading();
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: this.data.page + 1
    })
    // console.log(this.data.page)
    this.getCollectionArr(this.data.page, this.data.size);
  },

  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/home/home',
      // imageUrl: '/image/common/logo@2x.png'
    }
  }
})