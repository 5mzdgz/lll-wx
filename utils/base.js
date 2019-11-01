import { Config } from '../utils/config.js';

const app = getApp();

class Base{ 
  constructor(){
    this.BaseRequestUrl = Config.productUrl;
  }

  request(params){
    var that = this;
    var url = this.BaseRequestUrl + params.url;
    if(!params.type) {
      params.type = 'get';
    }
    /*不需要再次组装地址*/
    if(params.setUpUrl == false) {
      url = params.url;
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type':'application/json',
        //'token':wx.getStorageSync('token')
      },
      success:function(res){
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          // if (code == '401') {
          //   if (!noRefetch) {
          //     that._refetch(params);
          //   }
          // }
          that._processError(res);
          params.eCallback && params.eCallback(res.data);
        }
      },
      fail: function (err) {
        wx.hideNavigationBarLoading();
        that._processError(err);
        params.eCallback && params.eCallback(err);
      }
    })
  }
  //
  _processError(err) {
    // console.log(err);
  }

  // _refetch(param) {
  //   var token = new Token();
  //   token.getTokenFromServer((token) => {
  //     this.request(param, true);
  //   });
  // }

  /*获取元素上绑定的值*/
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }
}

export { Base };