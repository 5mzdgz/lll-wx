 // pages/car/car.js
import { Car } from 'car-model.js';
var car = new Car();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: false,
    loadingHidden: false,
    itemTotalPrice: 0,
    selectStatus:false,
    selectAllStatus: false,
    previousMargin: '610rpx',
    nextMargin: '0rpx'
  },

  onLoad: function (options) {
    // this.resetCarData()
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
    this.resetCarData();
    this.resetCart();
    this.resetCheckbox();
  },
  //购物车数据
  resetCarData:function() {
    var car = new Car();
    var that = this;
    car.getUserCarData((carData) => {
      
      var code = carData.data.code;
      var carDataArr = carData.data.data;
      // console.log(carDataArr)
      if (code === '200') {
        this.setData({
          carDataArr: carDataArr,
          loadingHidden: true
        })  
      } else if (code === '90001' || code === '90002') {
        app.getAccessToken();
        this.resetCarData();
      }  
    })
  },
  //计算商品数量
  checkTotals: function () {
    var totalCount = 0;
    var itemTotalPrice = 0;
    var carDataArr = this.data.carDataArr;
    // console.log(carDataArr)
    if (carDataArr.length > 0) {
      for (var i = 0; i < carDataArr.length; i++) {
        var carData = carDataArr[i];
        if (carData.checked) {
          totalCount += carData.qty;
          itemTotalPrice += carData.qty * carData.nowPrice;
        }
      }
      itemTotalPrice = itemTotalPrice.toFixed(2);

      this.setData({
        qty: carData.qty,
        itemTotalPrice: itemTotalPrice
      })
    }
  },

  //减商品数量
  onReduceNum: function (e) {
    var car = new Car();
    var index = e.target.dataset.index;
    var carDataArr = this.data.carDataArr;
    var qty = carDataArr[index].qty;
    if (qty <= 1) {
      return;
    } else {
      carDataArr[index].qty--;
      this.setData({
        carDataArr: carDataArr
      });
      this.checkTotals();
      car.updateCarQty(carDataArr[index]);
    }
  },
  //加商品数量
  onAddNum: function(e) {
    var car = new Car();
    var index = e.target.dataset.index;
    var carDataArr = this.data.carDataArr;
    var count = carDataArr[index].qty;
    carDataArr[index].qty++;
    this.setData({
      carDataArr: carDataArr
    });
    this.checkTotals();
    car.updateCarQty(carDataArr[index]);
  },

  //用户选中商品
  checkboxChange: function (e) {
    var checkboxItems = this.data.carDataArr;
    var values = e.detail.value;
    for (var i = 0; i < checkboxItems.length; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0; j < values.length; ++j) {
        if (checkboxItems[i].pid == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    var checkAll = false;
    if (checkboxItems.length == values.length) {
      checkAll = true;
    }

    this.setData({
      carDataArr: checkboxItems,
      checkAll: checkAll
    });
    // console.log(checkboxItems);
    this.checkTotals();
  },
  
  //用户点击全选
  selectalltap: function (e) {
    var value = e.detail.value;
    var checkAll = false;
    if (value && value[0]) {
      checkAll = true;
    }

    var carDataArr = this.data.carDataArr;
    for (var i = 0; i < carDataArr.length; i++) {
      var carData = carDataArr[i];
      carData['checked'] = checkAll;
    }

    this.setData({
      checkAll: checkAll,
      carDataArr: carDataArr
    });
    this.checkTotals();
  },

  // 未下单返回购物车页面刷新并重置单选
  resetCheckbox:function() {
    var checkboxItems = this.data.carDataArr;
    // console.log(checkboxItems);
    if (checkboxItems) {
      for (var i = 0; i < checkboxItems.length; ++i) {
        if (checkboxItems[i].checked == true) {
          checkboxItems[i].checked = false;
          break;
        }
      }

      this.setData({
        loadingHidden: true,
        carDataArr: checkboxItems
      });
      this.checkTotals();
    }
  },

  // 未下单返回购物车页面刷新并重置全选
  resetCart: function() {
    if(this.data.checkAll == true) {
      var carDataArr = this.data.carDataArr;
      for (var i = 0; i < carDataArr.length; i++) {
        var checkAll = false;
        var carData = carDataArr[i];
        carData['checked'] = checkAll;
      }

      this.setData({
        checkAll: checkAll,
        loadingHidden: true,
        carDataArr: carDataArr
      });
      // console.log(carDataArr);
      this.checkTotals();
    }
  },

  //去支付并改变后台商品数据
  goPay: function () {
    // console.log(this.data.carDataArr);
    var checkAllTrue = this.data.carDataArr.filter(function(item) {
      return item.checked == true
    });
    // console.log(checkAllTrue);
    var arr = [];
    // 选中的商品的pid,qty
    if (checkAllTrue.length > 0) {
      for (var i = 0; i < checkAllTrue.length; i++) {
        arr.push({
          id: checkAllTrue[i].id,
          pid: checkAllTrue[i].pid,
          qty: checkAllTrue[i].qty
        });
      }
      // console.log(arr);
      // 回调传递
      car.goPayOrder(arr, (resData) => {
        // console.log(resData.data.data);
        var str = JSON.stringify(resData.data.data)
        wx.navigateTo({
          url: '../pay/pay?jsonStr=' + str,
        })
      });
    } else {
      wx.showToast({
        title: '未选中商品哦',
        icon: 'loading',
        duration: 1000
      })
    } 
  },
  //加入收藏夹
  collectionTap:function(e) {
    var that = this;
    var pid = e.target.dataset.id;
    // console.log(this.data.carDataArr)
    car.colProductItem(pid,(resCol) => {
      // console.log(resCol)
      that.setData({
        nextMargin: '280rpx'
      })
      if (that.data.nextMargin === '280rpx') {
        that.onShow();
      }
    })
  },
  // 第一次触碰
  touchstart: function() {
    this.setData({
      nextMargin: '0rpx'
    })
  },

  // 删除购物车某项商品
  deleteCarItem:function(e) {

    var that = this
    var item = [];
    var id = e.target.dataset.id;
    // console.log(id)
    var index = e.target.dataset.index;
    // this.data.carDataArr.splice(index, 1);
    item.push({id: id})
    car.delCarItem(item,(resDel)=>{
      // console.log('删除成功')
      var carDataArr = this.data.carDataArr;
      carDataArr.splice(index, 1);
      this.setData({
        nextMargin: '280rpx',
        carDataArr: carDataArr
      })
      if (this.data.nextMargin === '280rpx') {
        that.onShow();
      }
    })
  },

  //购物车为空，点击去首页
  goShopping:function () {
    wx.switchTab({
      url: '../category/category',
    })
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

  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/home/home',
      imageUrl: 'https://img.laoliangli.com/banner/banner-bedfeb9f34684f5ea19ebf15e7440b64.png'
    }
  }
})