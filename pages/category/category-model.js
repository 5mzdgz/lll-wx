import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Category extends Base {
  constructor () {
    super();
  }
  /*获取分类所有分类*/
  getCategoryType(callback) {
    var param = {
      url: '/l/v1/category/all',
      sCallback:function (res) {
        callback && callback(res.data);
      }
    };
    this.request(param);
  }

  /*获取某种分类的商品*/
  getProductsByCategory(page, size, index, sort, callback) {
    // console.log(index)
    var categoryProductUrl;

    if (index === '0' || index === 0) {
      categoryProductUrl = Config.productUrl + '/l/v1/product/search?page=' + page + '&size=' + size;
    } else{
      categoryProductUrl = Config.productUrl + '/l/v1/product/search?page=' + page + '&size=' + size + '&categoryId=' + index;
    }
  /* 排序*/
    if (sort != '') {
      categoryProductUrl += '&sort=' + sort;
    }

    // console.log(categoryProductUrl);
    wx.request({
      url: categoryProductUrl,
      success: function (res) {
        var  resData = res.data.data
        // console.log(resData)
        callback && callback(resData);
      },
      fail: function () {
        // console.log("失败了");
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
}

export { Category };