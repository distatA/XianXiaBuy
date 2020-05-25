import axios from "../../request/axios";
Page({
  category: [],

  data: {
    // 左侧数据
    categoryLeft: [],
    // 点击索引值
    activeIndex: 0,
    // 右侧数据
    categoryRight: [],
    scrollTop:0,
    order:0
  },
  // 封装处理category的函数
  getCategory(){
    // 子数据,默认显示第一个
      // 去除一些不必要的数据,减低损耗性能
      const categoryLeft = this.category.map((v) => {
        // 返回对象
        return {
          cat_id: v.cat_id,
          cat_name: v.cat_name,
        };
      });

      const categoryRight = this.category[0].children;

      // 同步修改data里的数据
      this.setData({ categoryLeft, categoryRight });
  },
  // tab栏切换
  handleClick(e) {
    const { index } = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset.index);

    this.setData({
      activeIndex: index,
      categoryRight: this.category[index].children,
      // 点击其他tab栏会回到顶部 
      scrollTop:0,
      order:0
    });
  },
  // 自定义数据接收请求回来完整的数据
  getCatgorys() {
    axios({ url: "/categories" }).then((res) => {
      // 把数据赋值到自定义的数组里
      this.category = res.data.message;
      this.getCategory()
      // 避免每次加载都请求数据,导致体验不好,保存到本地,因为数据是永久保存在本地的,需要设置时效性,定时重新请求
      wx.setStorageSync('category', {
        time:Date.now(),
        data:this.category
      })
    });
  },
  clikCategoryRight(e){
      // console.log(e.currentTarget.dataset.order);
      const { order } = e.currentTarget.dataset
      console.log(order);
      this.setData({order})
      
  },
  onLoad: function () {
    // 获取本地数据 
    var value = wx.getStorageSync('category')
    if ( !value) {
    this.getCatgorys();
    console.log('没有数据,重新请求');

    }else if ( Date.now() - value.time > 1000 * 60 * 5  ) {
    this.getCatgorys();
      console.log('五分钟过去了,重新请求');
      
    }else{
    console.log('用本地数据');
    // 重新赋值给自定义数组,重新走一遍流程
          this.category = value.data 
          this.getCategory()
    }
    // 调用请求数据的函数
    // this.getCatgorys();
  },
});
