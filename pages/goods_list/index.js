import axios from "../../request/axios"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
    tabList:[
      { value:'综合',id:'1' },
      { value:'销量',id:'2' },
      { value:'价格',id:'3' },
    ],
    goodsList:[]
  },
  params:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:20
  },
  // 文章总条数 
  totalPages:'',
  // 数据列表请求的函数 
  getProductList(){
    axios({
      url:'/goods/search',
      data:this.params
    }).then(res=>{
      console.log(res);
      // 赋值到data 
        const  goodsList  = res.data.message.goods 
          this.totalPages = res.data.message.total
          
        console.log( goodsList );
        // 修改视图数据 
        // 因为是下拉的话会请求更多数据,合并到原有的数组里
     
        
        this.setData({ goodsList:[...this.data.goodsList,...goodsList]})
        
    })
  },
  onLoad: function (options) {
    // 拿到携带过来的参数 
    // 参数不一定是id还是关键字,用短路运算,如果是undefined就取空
    this.params.cid =  options.cid || '' 
    this.params.query = options.query || ''
    // console.log(this.params);
    
    
    this.getProductList()
  },

  // 上拉加载 
  onReachBottom () { 
    console.log('上啦加载');
    // 判断总数还有的情况不断继续请求数据 
    if (Math.ceil(this.totalPages / this.params.pagesize) > this.params.pagenum) {
      
      // 页数加加
      this.params.pagenum++;
        this.getProductList()
        // 数据加载完毕就提示
    }else {
      wx.showToast({
        title: '没有内容啦',
        icon: 'none',
      })
    }
   },
  //  下拉刷新
 async onPullDownRefresh(){
      console.log('还没刷新');
      // 清空数组,重新请求
      this.setData({goodsList:[] })
      this.params.pagenum =1
      // 等请求数据完成后才执行上拉结束的API
     await this.getProductList()

    wx.stopPullDownRefresh()
    console.log('刷新完毕');
    
  },


})