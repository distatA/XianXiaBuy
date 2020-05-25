
Component({
  data: {
    current: 0,
    tabBar: [
      { class: "iconshouye", value: "首页", src: "/pages/index/index", id: 0 },
      {
        class: "iconfenlei",
        value: "分类",
        src: "/pages/category/index",
        id: 1,
      },
      { class: "icongouwu", value: "购物车", src: "/pages/cart/index", id: 2 },
      { class: "iconwode", value: "我的", src: "/pages/user/index", id: 3 },
    ],
  },
  methods:{
    tabbarClick(e) {
      // console.log(e);
   
      console.log(e.currentTarget.dataset.id);
      // 切换tab栏
      this.setData({
        current: e.currentTarget.dataset.id,
      });
      // e.currentTarget.dataset.src
      wx.navigateTo({
        url: `${e.currentTarget.dataset.src}?id=${e.currentTarget.dataset.id}`,
        success:(res)=>{
          this.setData({
            current: e.currentTarget.dataset.id,
          });
        },
  
      });
    },
  }
});
