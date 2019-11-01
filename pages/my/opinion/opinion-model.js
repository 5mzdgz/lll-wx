import { Config } from '../../../utils/config.js';

const app = getApp();

class Opinion {
  constructor() {
    // super();
  }

// 图片
  uploadimg(data, uploadImages, feedbackContent, self) {
    var loginToken = wx.getStorageSync('loginToken');
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: null,
      header: {
        'content-type': 'multipart/form-data',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: (res) => {
        var resData = JSON.parse(res.data)
        app.returnCode(resData.code, resData.msg);
        // console.log(resData)
        if(i == 0 || i === 0){
          uploadImages = resData.data
        }else{
          uploadImages = uploadImages + "|" + resData.data;
        }
        //callback && callback(resData)
        success++;
        // console.log(i);
        //这里可能有BUG，失败也会执行这里
      },
      fail: (res) => {
        fail++;
        // console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        // console.log(i);
        i++;
        if (i == data.path.length) {   //当图片传完时，停止调用
          // console.log(uploadImages);
          // console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
          var obj = {
            uploadImg: uploadImages,
            content: feedbackContent
          }
          // console.log(feedbackContent);
          that.feedback(obj, self)
        } else {//若图片还没有传完，则继续调用函数
          // console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data, uploadImages, feedbackContent);
        }
      }
    });
  };

  feedback(obj, self) {
    // console.log(obj);
    // console.log(app.globalData.accessToken)
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v2/feedback/upload';
    wx.request({
      url: url,
      data: obj,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      method: 'POST',
      success: function(res) {
        app.returnCode(res.data.code, res.data.msg);
        // console.log(res.data.code)
        if (res.data.code === '200') {
          self.setData({
            imageList: [],
            concent: ''
          })
          wx.showModal({
            title: '提示',
            content: '感谢您的宝贵意见',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '服务器异常',
            showCancel: false
          })
          return;
        }
      },
      fail: function (e) {
        // console.log(e);
        wx.showModal({
          title: '提示',
          content: '服务器异常',
          showCancel: false
        })
      },
    })
  }
}

export { Opinion };