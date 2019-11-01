import { Config } from '../utils/config.js';
const app = getApp();

class MemberBase {
  constructor() {
    this.BaseUrl = Config.memberUrl;
  }

  request(params) {
    var that = this;
    var url = this.BaseUrl + params.url;
    if (!params.type) {
      params.type = 'get';
    }
    /*不需要再次组装地址*/
    if (params.setUpUrl == false) {
      url = params.url;
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': wx.getStorageSync('loginToken')
      },
      success: function (res) {
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        if (res.data.code === '200') {
          params.sCallback && params.sCallback(res.data);
        }
        if (res.data.code === '90002' || res.data.code === '90001') {
          params.sCallback && params.sCallback(res.data);
          // 可以提示网络异常
          // console.log('9001')
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 1000
          })
          app.getAccessToken();
        } else if (res.data.code === '105') {
          // console.log(105)
          // 未登录 --》去登录
          wx.showToast({
            title: '请重新登录',
            icon: 'none',
            duration: 1000
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })
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
}

export { MemberBase };