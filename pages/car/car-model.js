import { Config } from '../../utils/config.js';

const app = getApp();

class Car {
  constructor() {
    // super();
    this._storageKeyName='car';
  }
  //获取用户购物车信息
  getUserCarData(callback) {
    var loginToken = wx.getStorageSync('loginToken');
    // console.log(app.globalData.accessToken);
    wx.request({
      url: Config.orderUrl+'/l/v1/cart/list',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res)
      }
    })
  };
  // 更新商品数量
  updateCarQty(items,callback) {
    var loginToken = wx.getStorageSync('loginToken');
    // console.log(app.globalData.accessToken);
    wx.request({
      url: Config.orderUrl + '/l/v1/cart/qty/update',
      method: 'POST',
      data: items,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          callback && callback(res)
        }
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  };
  // 删除商品
  delCarItem(item, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    // console.log('...')
    wx.request({
      url: Config.orderUrl + '/l/v1/cart/delete',
      method: 'POST',
      data: item,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          callback && callback(res)
        } 
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  };

  // 加入收藏
  colProductItem(id, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/collect/cart/remove?pid=' + id,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          callback && callback(res)
        } 
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  };

  //下单
  goPayOrder(arr, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.orderUrl + '/l/v2/order/confirm/product/list',
      method: 'POST',
      data: arr,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          callback(res)
        }
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  }
};

//加入购物车


export {Car};