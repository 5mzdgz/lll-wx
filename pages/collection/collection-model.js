import { Config } from '../../utils/config.js';

const app = getApp();

class Collection {
  constructor() {
    // super();
  }
  
  //  获取收藏列表
  getCollectionList(page, size, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    // console.log(app.globalData.accessToken);
    wx.request({
      url: Config.memberUrl + '/l/v1/user/collect/list?page=' + page + '&size=' + size,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        callback && callback(res)
        app.returnCode(res.data.code, res.data.msg);
      }
    })
  }

  //  删除
  delCollection(id, callback) {
    var loginToken = wx.getStorageSync('loginToken');
    // console.log(app.globalData.accessToken);
    wx.request({
      url: Config.memberUrl + '/l/v1/user/collect/delete?ids=' + id,
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
  }

}


export { Collection };