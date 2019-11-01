// pages/my/maintain/photograph/photograph.js
import { Config } from '../../../../utils/config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    showIcon: true,
    photoArr: [
      { headImgUrl: null  },
      { headImgUrl: null }
    ],
    orderNumber: null,
    more: '上传更多',
    submitted: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderNumber = options.orderNumber;
    var orderId = options.orderId;
    // console.log(orderNumber);
    this.setData({
      orderNumber: orderNumber,
      orderId: orderId
    });
  },
  /**
   * 更多照片列表
   */
  morePhotoTap:function() {
    var photoArr = this.data.photoArr;
    var item = { headImgUrl: null };
    if (photoArr.length < 7) {
      photoArr.push(item);
      this.setData({
        photoArr: photoArr
      })
    } else {
      this.setData({
        more: '最多可上传7张'
      })
    }
  },

  /**
   * 拍照上传
   */
  photographTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var photoArr = this.data.photoArr;
    // console.log(index);
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res)
        photoArr[index].headImgUrl = res.tempFilePaths[0];
        that.setData({
          photoArr: photoArr
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 确认提交
   */
  confrimTap: function (e) {
    if (this.data.submitted) {
      wx.showToast({
        title: '该订单图片已上传过',
        icon: 'none'
      })
      return false;
    }
    var photoArr = this.data.photoArr;
    // console.log(photoArr);
    if (!photoArr[0].headImgUrl) {
      wx.showToast({
        title: '请上传主图',
        icon: 'none'
      })
      return;
    }
    
    var path = [];
    photoArr.forEach((item) => {
      if (item.headImgUrl) {
        path.push(item.headImgUrl);
      }
    })
    // console.log(path)
    var data = {
      url: Config.memberUrl + '/l/v1/upload/image?folder=mat',//这里是你图片上传的接口
      path: path//这里是选取的图片的地址数组
    }
    var uploadImages;
    // console.log(path.length)
    if (path.length < 2) {
      wx.showToast({
        title: '请上传至少两张图片',
        icon: 'none'
      })
      return;
    }
    this.uploadimg(data, uploadImages, this.data.orderNumber);
  },

  // 图片
  uploadimg: function (data, uploadImages, orderNumber) {
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
        if (i == 0 || i === 0) {
          uploadImages = resData.data
        } else {
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
            orderNumber: orderNumber,
            uploadImages: uploadImages
          }

          that.feedback(obj);
        } else {//若图片还没有传完，则继续调用函数
          // console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data, uploadImages, orderNumber);
        }
      }
    });
  },

  feedback: function (obj) {
    // console.log(obj);
    // console.log(app.globalData.accessToken)
    var that = this;
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v2/mat/order/upload';
    wx.request({
      url: url,
      data: obj,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      method: 'POST',
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        // console.log(res.data)
        if (res.data.code === '200') {
          var photoArr = [
            { headImgUrl: null },
            { headImgUrl: null }
          ];
          that.setData({
            photoArr: photoArr,
            submitted: true
          });
          wx.navigateTo({
            url: '../maintain-result/maintain-result?flag=3' + '&orderId=' + that.data.orderId,
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})