import axios from "../../request/axios";
Page({
  data: {
    goodsDetail: [],
    show: true,
  },
  // 页面ID
  cat_id: "",
  goodsObj:{},
  getSwiper() {
    axios({
      url: "/goods/detail",
      data: {
        goods_id: this.cat_id,
      },
    }).then((res) => {
      // console.log(res);
      let goodsDetail = res.data.message;

      // 把需要的属性存起来,用于加入购物车使用
      const { goods_id, goods_price , goods_name , goods_small_logo} = goodsDetail 
      this. goodsObj = {
        goods_id,
        goods_price,
        goods_name, 
        goods_small_logo
      }
       console.log(this.goodsObj);
          
      // 富文本的图片有3cm的默认样式,小程序只认识类,所以全局匹配添加类,把默认样式清除
      goodsDetail.goods_introduce = goodsDetail.goods_introduce.replace(
        /<img/g,
        '<img class="my_img"'
      );
      // ios不支持webp,但webp加载速度快,优先使用webp格式,检测如果是ios系统,就换为jpg格式,=>图文详情的照片
      const SystemInfo = wx.getSystemInfoSync();
      // console.log(SystemInfo);
      // 如果 system属性里面包含IOS,就替换格式
      if (SystemInfo.system.toLowerCase().indexOf("ios") > -1) {
        // 替换后缀名
        goodsDetail.goods_introduce = goodsDetail.goods_introduce.replace(
          /.webp/g,
          ".jpg"
        );
        // console.log( goodsDetail.goods_introduce);
      }
      this.setData({ goodsDetail });
    });
  },
  // 预览图片
  previewImage(e) {
    const { current } = e.currentTarget.dataset;
    // 遍历出一个纯字符串的数组,微信图片预览规定必须是数组里的字符串
    const urls = this.data.goodsDetail.pics.map((v) => v.pics_big);
    // 点击预览图片
    wx.previewImage({
      current: "current",
      urls,
    });
    wx.saveImageToPhotosAlbum({
      success(res) {
        console.log(res);
      },
    });
  },
  // 页面滚动条数据
  onPageScroll: function (e) {
    const scrollNum = parseInt(e.scrollTop);
    // console.log(scrollNum)
    // 大于2000就显示
    if (scrollNum > 2000) {
      this.setData({ show: false });
    } else {
      this.setData({ show: true });
    }
  },
  // 点击回到顶部
  handleTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  },
  // 提示加入购物车信息
  getcartTips(title,icon){
    wx.showToast({
      title,
      icon,
      mask:true,
      duration:1500
    });
  },
  // 跳转购物车
  gotoCar() {
    wx.switchTab({
      url: "/pages/cart/index",
    });
  },
  // 加入购物车
  joinCar() {
    let cart = wx.getStorageSync('cart') || []
   const index = cart.findIndex(item => item.goods_id === this.goodsObj.goods_id)

    console.log(index);
    console.log(cart);
    // 如果找不到就执行以下
    if (index === -1 ) {
      this.getcartTips('已添加到购物车','success')
      // 添加个勾选属性
      this.goodsObj.isSelect = true
      // 添加个数量属性
      this.goodsObj.count =1;
      // 追加到数组里面 
      cart.unshift(this.goodsObj)      
    }else{
      this.getcartTips('已添加到购物车','success')
      // 否则根据索引把数量加累计起来
      cart[index].count += 1; 
    }
    wx.setStorageSync('cart', cart)
  },
  // 立即购买
  buyNow() {
    this.getcartTips('余额不足','none')
  },
  // 页面加载
  onLoad: function (options) {
    this.cat_id = options.id;
    this.getSwiper();
  },
});
