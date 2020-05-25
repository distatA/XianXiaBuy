import axios from "../../request/axios";
Page({
  data: {
    swiperImg: [],
    navData: [],
    ContentData: [],
  },
  // 自定义数据
  getSwiperData() {
    axios({ url: "/home/swiperdata" }).then((res) => {
      const swiperData = res.data.message;
      this.setData({
        swiperImg: swiperData,
      });
    });
  },
  getNavData() {
    axios({ url: "/home/catitems" }).then((res) => {
      const navData = res.data.message;
      navData.forEach((item) => {
        if (item.navigator_url) {
          item.navigator_url = item.navigator_url.replace("/main", "/index");
        }
      });
      this.setData({ navData });
    });
  },
  getfloorData() {
    axios({ url: "/home/floordata" }).then((res) => {
      // console.log(res);
      const ContentData = res.data.message;
      res.data.message.forEach((item, index) => {
        item.id = index;
        item.product_list.forEach((v) => {
          //  修改路径
          v.navigator_url = v.navigator_url.replace(
            "/goods_list",
            "/goods_list/index"
          );
        });
      });
      this.setData({ ContentData });
    });
  },
  onLoad() {
    this.getSwiperData()
    this.getNavData()
    this.getfloorData()
  },
  handleImg(e) {
    console.log(e);
    const imgsrc = e.currentTarget.dataset.value;
    console.log(imgsrc);

    wx.navigateTo({
      url: imgsrc,
    });
  },
});
