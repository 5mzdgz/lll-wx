import { Config } from '../../../utils/config.js';

const app = getApp();

class CouponProduct {
  constructor() {
    // super();
  }

  //获取折扣及优惠卷
  getCouponProductData(obj, page, size, sort, callback) {
    // var loginToken = wx.getStorageSync('loginToken');
    // console.log(sort)
    /* 排序*/
    var oUrl = Config.productUrl + '/l/v1/coupon/product/search?page=' + page + '&size=' + size;
    if (sort != '') {
      oUrl += '&sort=' + sort;
    }
    wx.request({
      url: oUrl,
      method: 'GET',
      data: obj,
      success: function (res) {
        // console.log(res.data.data)
        var resData = res.data.data;
        callback && callback(resData)
      }
    })
  }
};

//加入购物车


export { CouponProduct };