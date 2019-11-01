

Page({
  data: {
    showIcon:true
  },
  /*分享*/
  onShareAppMessage: function () {
    return {
      title: '老良利珠宝',
      path: 'pages/my/about/about',
      imageUrl: 'https://img.laoliangli.com/banner/banner-bedfeb9f34684f5ea19ebf15e7440b64.png'
    }
  }
})