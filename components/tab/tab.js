// components/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // tab栏索引 
    activeIndex:0,
    // tab栏数据
    tabList:[
      { value:'综合',id:'1' },
      { value:'销量',id:'2' },
      { value:'价格',id:'3' },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTab(e){
      // console.log(e.currentTarget.dataset.index);
      const { index } = e.currentTarget.dataset;
      this.setData({ activeIndex :index})
      
    },
  }
})
