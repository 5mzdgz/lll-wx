
import {
  Config
} from '../../../utils/config.js';

const app = getApp();

Page({
  data: {
    showIcon: true,
    array:['男','女']
  },

  onLoad: function(opitons) {
    
  },

  onShow: function() {
    this.currentUserInfo();
  },

  currentUserInfo: function() {
    var loginToken = wx.getStorageSync('loginToken');
    var that = this;
    wx.request({
      url: Config.memberUrl + '/l/v1/user/info',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function(res) {
        if (res.data.code === '200') {
          var resData = res.data.data;
          var resCode = res.data.code;
          var headImgUrl = resData.headImgUrl;
          var nickName = decodeURIComponent(resData.nickname);
          var sex = resData.sex;
          var autograph = decodeURIComponent(resData.autograph);
          if (sex == 1) {
            sex = '男';
          } else if (sex == 2) {
            sex = '女';
          } else {
            sex = '未填写';
          }
          // console.log(nickName);
          // console.log(autograph);
          if (nickName == null || nickName === 'null' || nickName === '') {
            nickName = '未填写'
          }
          if (autograph == null || autograph === 'null' || autograph === '') {
            autograph = '未填写';
            // that.setData({
            //   noData:true
            // })
          }
          that.setData({
            headImgUrl,
            nickName,
            sex,
            autograph
          })

        } 
        app.returnCode(res.data.code, res.data.msg);
      },
      fail: function(res) {
        // console.log(res.msg)
      }
    })
  },

  changeHead: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        // console.log(res)
        var tempFilePaths = res.tempFilePaths;
        // that.setData({ userImg: tempFilePaths})
        that.upload(that, tempFilePaths)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  upload: function (page, path) {
    var that = this;
    var loginToken = wx.getStorageSync('loginToken');
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    // console.log(app.data.mytoken)
    wx.uploadFile({
      url:  Config.memberUrl + '/l/v1/user/upload/image',
      method: 'post',
      filePath: path[0],
      name: 'file',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success: function (res) {
        // console.log(res);
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        // app.data.useLocaImg = 1
        that.setData({ //上传成功修改显示头像
          headImgUrl: path[0]
        })
        prevPage.setData({
          headImgUrl: path[0]
        })
        //将图片地址存到本地缓存
        // wx.setStorage({
        //   key: 'headImgUrl',
        //   data: path[0]
        // })
      },
      fail: function (e) {
        // console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  },
  /**
   * 修改昵称
   */
  changeNickName:function() {
    // console.log(this.data.nickName);
    wx.navigateTo({
      url: '../../my/user/nick/nick?nickName=' + this.data.nickName
    })
  },
  /**
   * 修改性别
   */
  changeSex: function (e) {
    var that = this;
    var loginToken = wx.getStorageSync('loginToken');
    var tSex = this.data.array[e.detail.value];
    // console.log(tSex)
    var sSex;
    if(tSex === '男') {
      sSex = 1
    }else if(tSex === '女') {
      sSex = 2
    }
    // console.log(this.map.tSex)
    wx.request({
      url: Config.memberUrl + '/l/v1/user/sex/update',
      data: {
        sex: sSex
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'accessToken': app.globalData.accessToken,
        'loginToken': loginToken
      },
      success:function(res) {
        // console.log(res)
        that.setData({
          sex: tSex
        })
      }
    })
  },
  /**
   * 修改个性签名
   */
  changeAut:function() {
    // console.log(this.data.autograph)
    wx.navigateTo({
      url: '../../my/user/autograph/autograph?autograph=' + this.data.autograph
    })
  }

})