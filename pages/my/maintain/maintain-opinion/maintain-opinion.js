// pages/my/maintain/maintain-opinion/maintain-opinion.js
import { Config } from '../../../../utils/config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    textarea: '本次的保养服务满足您的期望吗？请在评论区留下您宝贵的评论和建议，我们将竭力做到更好！',
    scoreArr: ['非常差', '差', '一般', '好', '非常好'],
    currentIndex: 4,
    imageList: [],
    orderNumber: null,
    score: 10,
    isOpinion: false,
    submitted: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scoreArr = this.data.scoreArr;
    var orderNumber = options.orderNumber;
    // console.log(orderNumber)
    var scoreStatus = scoreArr[this.data.currentIndex];
    this.setData({
      scoreStatus: scoreStatus,
      orderNumber: orderNumber
    })
  },

  /**
   * 评分
   */
  scoreTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var scoreArr = this.data.scoreArr;
    // console.log(index);
    this.setData( {
      currentIndex: index,
      scoreStatus: scoreArr[index],
      score: (index + 1) * 2
    })
    // console.log(this.data.score);
  },
  /**
   * 删除
   */
  deletImgTap: function(e) {
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    var imageList = this.data.imageList;
    imageList.splice(index, 1);
    this.setData({
      imageList: imageList
    })
  },
  /**
   * 添加图片
   */
  addImgTap: function () {
    var len = this.data.imageList.length;
    if (len === 9) {
      wx.showToast({
        title: '最多可上传9张',
        icon: 'none'
      })
      return
    }
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res.tempFilePaths)
        var imageList = that.data.imageList;
        res.tempFilePaths.forEach((item) => {
          imageList.push(item);
        });
        that.setData({
          imageList: imageList
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 提交
   */
  bindFormSubmit: function(e) {
    var content = e.detail.value.textarea;
    if (content.length <= 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return false;
    }
    if (this.data.submitted) {
      wx.showToast({
        title: '该订单意见反馈过',
        icon: 'none'
      })
      return false;
    }
    var data = {
      url: Config.memberUrl + '/l/v1/upload/image?folder=feedback',//这里是你图片上传的接口
      path: this.data.imageList,//这里是选取的图片的地址数组
    }

    var uploadImages;
    var orderNumber = this.data.orderNumber;
    var score = this.data.score;
    var obj = {
      content: content,
      orderNumber: orderNumber,
      score: score
    };
    if (this.data.imageList.length === 0) {
      this.feedback(obj);
    } else {
      this.uploadimg(data, uploadImages, content, orderNumber, score);
    }
  },
  uploadimg: function (data, uploadImages, content, orderNumber, score) {
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
            uploadImages: uploadImages,
            content: content,
            orderNumber: orderNumber,
            score: score
          }
          // console.log(feedbackContent);
          that.feedback(obj, self)
        } else {//若图片还没有传完，则继续调用函数
          // console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data, uploadImages, content, orderNumber, score);
        }
      }
    });
  },

  feedback: function(matorderfeedback) {
    var self = this;
    // console.log(matorderfeedback);
    // console.log(app.globalData.accessToken)
    var loginToken = wx.getStorageSync('loginToken');
    var url = Config.memberUrl + '/l/v1/mat/order/feedback';
    wx.request({
      url: url,
      data: matorderfeedback,
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      method: 'POST',
      success: function (res) {
        app.returnCode(res.data.code, res.data.msg);
        // console.log(res.data.code)
        if (res.data.code === '200') {
          self.setData({
            imageList: [],
            concent: '',
            currentIndex: 4,
            score: 10,
            submitted: true
          })
          self.setData({ isOpinion: true });
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
   * 去优惠卷
   */
  goCouponTap: function() {
    wx.navigateTo({
      url: '../../coupon/coupon',
    })
    this.setData({ isOpinion: false });
  },
  /**
   * 关闭
   */
  closeInvitationTap: function() {
    this.setData({ isOpinion: false });
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