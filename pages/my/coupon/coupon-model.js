import { Config } from '../../../utils/config.js';

const app = getApp();

class Coupon {
  constructor() {
    // super();
  }
  //获取折扣及优惠卷
  getCouponData(status, page, size, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.orderUrl + '/coupon/v1/list?status=' + status + '&page=' + page + '&size=' + size,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        if (res.data.code === '200') {
          var resData = res.data.data;
          callback && callback(resData)
        }
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  }

  //获取折扣及优惠卷
  getCouponProductData(obj, callback) {
    // var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.productUrl + '/l/v1/coupon/product/search',
      method: 'GET',
      data: obj,
      success: function (res) {
        // console.log(res.data.data)
        var resData = res.data.data;
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(resData)
      }
    })
  }
};

//加入购物车


export { Coupon };