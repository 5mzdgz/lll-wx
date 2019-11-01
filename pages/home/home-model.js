import { Base } from '../../utils/base.js';

class Home extends Base{
  constructor() {
    super();
  }

  getBannerData(banner, callback) {
    var params = {
      url: '/l/v1/advert/map?pages=' + banner,
      sCallback:function(res){
        callback && callback(res.data);
        // console.log(res)
      }
    }
    this.request(params);
  }

  getRecommendData(lable, page, size, callback) {
    var params = {
      url: '/l/v1/product/search?lable=' + lable + '&page=' + page + '&size=' + size,
      sCallback: function (res) {
        callback && callback(res.data);
        // console.log(res)
      }
    }
    this.request(params);
  }

  newProducts(lable, page, size, callback) {
    var params = {
      url: '/l/v1/product/search?lable=' + lable + '&page=' + page + '&size=' + size,
      sCallback: function (res) {
        callback && callback(res.data);
        // console.log(res)
      }
    }
    this.request(params);
  }
}

export { Home }