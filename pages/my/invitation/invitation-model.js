import { Config } from '../../../utils/config.js';

const app = getApp();

class Invitation {
  constructor() {
    // super();
  }
  

  //获取二维码
  code(obj,callback) {
    var url = Config.memberUrl + '/l/v1/get/wx/applets/qr/code';
    // console.log(JSON.stringify(obj))
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: url,
      method: 'POST',
      data: JSON.stringify(obj),
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data.data)
      }
    })
  };

  // 获取邀请好友列表
  invitationData(page,size, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.orderUrl + '/invite/cash/back/user/list?page=' + page + '&size=' + size;

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data)
      }
    })
  };

  // 获取邀请提成统计
  invitationTotal(callback) {
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.orderUrl + '/invite/cash/back/count';

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data.data)
      }
    })
  };

}

export { Invitation };