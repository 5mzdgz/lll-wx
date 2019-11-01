// pages/my/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    setArr:[
      {
        id: 1,
        iconImg: 'https://img.laoliangli.com/label/common/my_info_icon.png',
        setTitle: '编辑个人资料',
        rightImg: 'https://img.laoliangli.com/label/my/arrow_right.png',
        grade: true
      },
      {
        id: 2,
        iconImg: 'https://img.laoliangli.com/label/common/reset_password_icon.png',
        setTitle: '设置支付密码',
        rightImg: 'https://img.laoliangli.com/label/my/arrow_right.png',
        grade: true
      },
      {
        id: 3,
        iconImg: 'https://img.laoliangli.com/label/common/switch_icon.png',
        setTitle: '切换账号',
        rightImg: 'https://img.laoliangli.com/label/my/arrow_right.png',
        grade: true
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var setArr = this.data.setArr;
    // console.log(options.grade)
    if (!options.grade) {
      setArr.forEach((item)=>{
        if (item.id===2) {
          item.grade = false
        }
      })
      this.setData({
        setArr: setArr
      })
    }
  },

  /**
   * 跳转
   */
  navitageTap: function (e) {
    var id = e.target.dataset.id
    // console.log(id)
    if (id === 1) {
      wx.navigateTo({
        url: '../user/user',
      })
    } else if (id === 2) {
      wx.navigateTo({
        url: '../set/reset-password/reset-password',
      })
    } else if (id === 3) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
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