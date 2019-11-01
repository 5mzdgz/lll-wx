// pages/product/product.js
import { Product } from 'product-model.js'
import { Car } from '../car/car-model.js';
var car = new Car();
var product = new Product();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    showPop: false,
    loadingHidden: false,
    isCollection: false,
    animationData: {},
    // swiperCurrent: 0,
    isVideo: false,
    videoUrl: '',
    show: true,
    sliderArr: {},
    idDetailData: {},
    number: 1,
    isCarRufund: 1,
    commodityAttr:[],
    firstIndex: -1,
    attributes: []
  },

  /*
    *点击自定义视频封面开始播放
    */
  playvedio: function (e) {
    let vediocon = wx.createVideoContext("myVideo", this)
    vediocon.play()
    // console.log(vediocon)

    this.setData({
      show: false
    })

    wx.showLoading({
      title: '加载中...',
      position: 'top'
    })
  },
  /*
  *视频播放完毕重新上封面
  */
  endvedio: function () {
    let vediocon = wx.createVideoContext("myVideo", this)
    // vediocon.play()
    // console.log(vediocon)
    this.setData({
      show: true
    })
  },
  /**
   * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
   */
  videoErrorCallback: function (e) {
    // console.log('视频错误信息:')
    // console.log(e.detail.errMsg)
  },

  bindplay: function () {//开始播放按钮或者继续播放函数
    // console.log("开始播放")
    wx.hideLoading();
  },
    bindpause: function() {//暂停播放按钮函数
    // console.log("停止播放")
  },
    bindend: function() {//播放结束按钮函数
    // console.log("播放结束")
    this.setData({
      show: true
    })
  },
    bindtimeupdate: function(res) {//播放中函数，查看当前播放时间等
    // console.log(res)//查看正在播放相关变量
    // console.log("播放到第" + res.detail.currentTime + "秒")//查看正在播放时间，以秒为单位
  },



  /**
   * 切换轮播图
   */
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击显示加入购物车弹出框
  clickme: function () {
    this.setData({
      isCarRufund: 1
    })
    this.setAttributes();
    this.showModal();
  },

  // 立即购买弹出框
  immePay: function (e) {
    this.setData({
      isCarRufund: 2
    })
    this.setAttributes();
    this.showModal();
  },

  // 设置属性
  setAttributes:function() {
    this.setData({
      includeGroup: this.data.commodityAttr
    });
    this.distachAttrValue(this.data.commodityAttr);
    // console.log(this.data.commodityAttr)
    // 只有一个属性组合的时候默认选中 
    if (this.data.commodityAttr.length == 1) {
      if (this.data.commodityAttr[0].attributes.length > 0) {
        for (var i = 0; i < this.data.commodityAttr[0].attributes.length; i++) {
          this.data.attributes[i].selectedValue = this.data.commodityAttr[0].attributes[i].valueName;
        }
        this.setData({
          attributes: this.data.attributes
        });
      }
    }
  },
  
  close:function() {
    this.hideModal();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    // console.log(id)
    this.data.id = id;
    this._loadData();
    this.checkCollecttion(id);
  },
  // 初始化数据
  _loadData:function() {
    product.getDetailInfo(this.data.id,(detailData) => {
      // console.log(this.data.id)
      // console.log(detailData)
      var idDetailData;
      var videoUrl = '';
      for (var i = 0; i < detailData.length; i++) {
        if (this.data.id == detailData[i].id){
          idDetailData = detailData[i]
          // console.log(idDetailData);
          // 主图
          var mainArr = detailData[i].imgs.filter((item) => {
            return item.isMain == true
          })
          // console.log()
          // 轮播图
          var silderArr = detailData[i].imgs.filter((item) => {
            return item.isThumb == true
          })
          // 详情图
          var detailArr = detailData[i].imgs.filter((item) => {
            return item.isDetail == true
          })
          // console.log(detailArr)
          // 弹框，小图
          var smallImg = detailData[i].imgs.find((item) => {
            return item.isSmall == true
          })
          //设置视频地址
          if (detailData[i].defaultVideoUrl === null){
            if (detailData[i].videos.length > 0){
              videoUrl = detailData[i].videos[0].videoUrl;
            }
          }else{
            videoUrl = detailData[i].defaultVideoUrl;
          }
        }
      }
      this.setData({
        loadingHidden: true,
        sliderArr: silderArr,
        detailArr: detailArr,
        smallImg: smallImg,
        mainArr: mainArr,
        idDetailData: idDetailData,
        commodityAttr: detailData,
        videoUrl: videoUrl
      })
    })
  },
  //减商品数量
  onReduce:function() {
    var num = this.data.number;
    if (num > 1) {
      num --;
    }else {
      num = 1;
    }
    this.setData({
      number: num
    });
  },
  //加商品数量
  onAdd:function() {
    var num = this.data.number;
    num ++;
    this.setData({
      number: num
    });
  },
  //购物车按钮
  goCarTap:function() {
    wx.switchTab({
      url: '../car/car',
    })
  },
  //收藏按钮
  onCollectionTap:function() {
    if (!this.data.isCollection) {
      product.addCollection(this.data.id, (resCol) => {
        // console.log(resCol)
        if (resCol.data.code === '200') {
          this.setData({ isCollection: true });
          wx.showToast({
            title: '加入收藏夹',
            icon: 'success',
            duration: 1000
          })
        }
      })
    }
  },

  //点击轮播图显示弹窗
  onProductCarItems:function() {
    this.showModal();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow: function () {

  },
  /* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    /** 
    将后台返回的数据组合成类似 
    { 
    keyName:'型号', 
    attributes:['1','2','3'] 
    } 
    */
    // 把数据对象的数据（视图使用），写到局部内 
    var attributes = this.data.attributes;
    // 遍历获取的数据 
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attributes.length; j++) {
        var attrIndex = this.getAttrIndex(commodityAttr[i].attributes[j].keyName, attributes);
        // console.log('属性索引', attrIndex); 
        // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置 
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理 
          if (!this.isValueExist(commodityAttr[i].attributes[j].valueName, attributes[attrIndex].attrValues)) {
            attributes[attrIndex].attrValues.push(commodityAttr[i].attributes[j].valueName);
          }
        } else {
          attributes.push({
            keyName: commodityAttr[i].attributes[j].keyName,
            attrValues: [commodityAttr[i].attributes[j].valueName]
          });
        }
      }
    }

    // console.log('result', attributes)
    //属性值进行排序
    if (attributes.length > 0){
      // console.log(attributes[0].keyName === "尺寸")
      for (var h = 0; h < attributes.length; h++) {
        if (attributes[h].keyName === "尺寸"){
          var attrValues = attributes[h].attrValues;
          var min;
          for (var i = 0; i < attrValues.length; i++) {
            for (var j = i; j < attrValues.length; j++) {
              if (attrValues[i] > attrValues[j]) {
                min = attrValues[j];
                attrValues[j] = attrValues[i];
                attrValues[i] = min;
              }
            }
          }
        }
      }
    }
     // console.log('attrValues', attrValues)
    for (var i = 0; i < attributes.length; i++) {
      for (var j = 0; j < attributes[i].attrValues.length; j++) {
        if (attributes[i].attrValueStatus) {
          attributes[i].attrValueStatus[j] = true;
        } else {
          attributes[i].attrValueStatus = [];
          attributes[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attributes: attributes
    });
  },
  getAttrIndex: function (attrName, attributes) {
    // 判断数组中的keyName是否有该属性值 
    for (var i = 0; i < attributes.length; i++) {
      if (attrName == attributes[i].keyName) {
        break;
      }
    }
    return i < attributes.length ? i : -1;
  },
  isValueExist: function (value, valueArr) {
    // 判断是否已有属性值 
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    /* 
    点选属性值，联动判断其他属性值是否可选 
    { 
    attrKey:'型号', 
    attributes:['1','2','3'], 
    selectedValue:'1', 
    attrValueStatus:[true,true,true] 
    } 
    console.log(e.currentTarget.dataset); 
    */
    var attributes = this.data.attributes;
    var index = e.currentTarget.dataset.index;//属性索引 
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
        // 取消选中 
        this.disSelectValue(attributes, index, key, value);
      } else {
        // 选中 
        this.selectValue(attributes, index, key, value);
      }
    }
  },
  /* 选中 */
  selectValue: function (attributes, index, key, value, unselectStatus) {
    // console.log('firstIndex', this.data.firstIndex);
    var includeGroup = [];
    // console.log(index, this.data.firstIndex, unselectStatus);
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选 
      var commodityAttr = this.data.commodityAttr;
      // 其他选中的属性值全都置空 
      // console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus);
      for (var i = 0; i < attributes.length; i++) {
        for (var j = 0; j < attributes[i].attrValues.length; j++) {
          attributes[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }

    // console.log('选中', commodityAttr, index, key, value);
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attributes.length; j++) {
        if (commodityAttr[i].attributes[j].keyName == key && commodityAttr[i].attributes[j].valueName == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attributes[index].selectedValue = value;
    // 判断属性是否可选 
    for (var i = 0; i < attributes.length; i++) {
      for (var j = 0; j < attributes[i].attrValues.length; j++) {
        attributes[i].attrValueStatus[j] = false;
      }
    }
    for (var k = 0; k < attributes.length; k++) {
      for (var i = 0; i < includeGroup.length; i++) {
        for (var j = 0; j < includeGroup[i].attributes.length; j++) {
          if (attributes[k].keyName == includeGroup[i].attributes[j].keyName) {
            for (var m = 0; m < attributes[k].attrValues.length; m++) {
              if (attributes[k].attrValues[m] == includeGroup[i].attributes[j].valueName) {
                attributes[k].attrValueStatus[m] = true;
              }
            }
          }
        }
      }
    }
    // 选中商品小图
    var smallImg = includeGroup[0].imgs.find((item) => {
      return item.isSmall == true
    })
    // console.log('结果', attributes); 
    // console.log('结果', smallImg);
    this.setData({
      attributes: attributes,
      includeGroup: includeGroup,
      idDetailData: includeGroup[0], //选中商品，动态展示商品的属性，及图片；
      smallImg: smallImg
    });

    // console.log(this.data.includeGroup[0]);

    var count = 0;
    for (var i = 0; i < attributes.length; i++) {
      for (var j = 0; j < attributes[i].attrValues.length; j++) {
        if (attributes[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) {// 第一次选中，同属性的值都可选 
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
  },
  /* 取消选中 */
  disSelectValue: function (attributes, index, key, value) {
    var commodityAttr = this.data.commodityAttr;
    attributes[index].selectedValue = '';

    // 判断属性是否可选 
    for (var i = 0; i < attributes.length; i++) {
      for (var j = 0; j < attributes[i].attrValues.length; j++) {
        attributes[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attributes: attributes
    });

    for (var i = 0; i < attributes.length; i++) {
      if (attributes[i].selectedValue) {
        this.selectValue(attributes, i, attributes[i].keyName, attributes[i].selectedValue, true);
      }
    }
  },
  /* 点击确定 */
  submit: function (e) {
    // console.log('3333');
    // console.log(this.data.includeGroup);
    var that = this;
    var value = [];
    var attributes = this.data.attributes;
    for (var i = 0; i < attributes.length; i++) {
      if (!attributes[i].selectedValue) {
        break;
      }
      value.push(attributes[i].selectedValue);
    }
    
    if (i < this.data.attributes.length) {
      wx.showToast({
        title: '请完善选择条件',
        icon: 'loading',
        duration: 1000
      })
    } else {
      this.hideModal();
      // console.log(this.data.includeGroup)
      // console.log(this.data.includeGroup.length)
      if (this.data.includeGroup.length == 0) {
        var item = [{ "pid": this.data.id, "qty": this.data.number }];
      } else {
        var item = [{ "pid": this.data.includeGroup[0].id, "qty": this.data.number }];
      }
      // console.log(item);
      if (this.data.isCarRufund == 1) {
        // 加入购物车
        product.addCar(item, (res) => {
          // console.log(res);
          if (res.data.code === '200') {
            // 延时提示
            setTimeout(function () {
              wx.showToast({
                title: value.join('-'),
                icon: 'success',
                duration: 1000
              })
            }, 500)
          }
          app.returnCode(res.data.code, res.data.msg);
        })
      } else if (this.data.isCarRufund == 2) {
        // 去支付
        car.goPayOrder(item, (resData) => {
          // console.log(resData.data.data);
          var str = JSON.stringify(resData.data.data)
          wx.navigateTo({
            url: '../pay/pay?jsonStr=' + str,
          })
        })
      }
      // 重置数量
      this.setData({
        number: 1
      })
      
      for(var i=0; i<attributes.length;i++) {
        // 移除选中的值
        delete attributes[i].selectedValue;
      }
      // console.log(attributes);
    }
  },

  /**
   * 用户是否收藏该商品
   */
  checkCollecttion: function(id) {
    product.collection(id, (res) => {
      // console.log(res)
      if (res.code === '209') {
        this.setData({ isCollection: true });
      }
    })
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
  // 显示底部弹层
  showModal: function () {
    var _this = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
      showPop: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export()
      })
    }.bind(_this), 50)
  },
  // 隐藏底部弹层
  hideModal: function () {
    var _this = this;
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export(),
        showPop: false
      })
    }.bind(this), 200)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var path;
    var loginToken = wx.getStorageSync('loginToken');
    var grade = wx.getStorageSync('grade');
    var scene = wx.getStorageSync('sceneId');
    if (grade && grade > 0) {
      path = 'pages/product/product?id=' + this.data.id + '&scene=' + scene;
    } else {
      path = 'pages/product/product?id=' + this.data.id;
    }
    return {
      title: '老良利珠宝',
      path: path,
      imageUrl: this.data.mainArr[0].imgUrl
    }
  }
})