import { Config } from '../../../../utils/config.js';
const app = getApp();

class Bill  {
  constructor() {
    // super();
  }

  /**
   * 获取列表
   */
  billArr(page, size, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    wx.request({
      url: Config.memberUrl + '/l/v1/user/consum/record?page=' + page + '&size=' + size,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res)
        app.returnCode(res.data.code, res.data.msg);
        callback && callback(res.data);
      }
    })
  }
}
export { Bill };