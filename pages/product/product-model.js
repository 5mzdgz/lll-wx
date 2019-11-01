import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
const app = getApp();

class Product extends Base {
  constructor() {
    super();
  }
  // 获取商品
  getDetailInfo(id, callback) {
    // console.log(id)
    var param = {
      url: '/l/v1/product/base/many?id=' + id,
      sCallback: function (res) {
        // console.log(res.data)
        callback && callback(res.data);
      }
    };
    this.request(param);
  }
  // 加入购物车
  addCar(item, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    //var accessToken = wx.getStorageSync('accessToken');
    wx.request({
      url: Config.orderUrl + '/l/v1/cart/add',
      method:'POST',
      data: item,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success:function(res) {
        // console.log(res)
        callback(res)
      }
    })
  }

  // 加入收藏夹
  addCollection(id, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/collect/add?ids=' + id,
      method: 'POST',
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
  }

  // 是否加入收藏夹
  collection(id, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/iscollect?pid=' + id,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        callback && callback(res.data)
      }
    })
  }
}

export { Product };