import Toast from '@vant/weapp/toast/toast';
import axios from "../../request/axios"
Page({

  data: {
    value: '',
    defaulGoods:[],
  },
 getGoodsItem(value){
    axios({
      url:'/goods/search',
      data:{
        query:value,
        pagenum:1,
        pagesize:10
      }
    }).then(res=>{
      console.log(res);
      const  { goods } = res.data.message
      this.setData({defaulGoods:goods })
    })

 },
  onLoad: function (options) {
    this.getGoodsItem('电视机')
  },
  onChange(e) {
    console.log(e.detail);
    this.setData({value:e.detail})
    // this.getGoodsItem(e.detail) 
    if (e.detail === ' ') {
        this.setData({
          defaulGoods:[]
        })
    }
  },
  onSearch() {
    this.getGoodsItem(this.data.value) 
    
  },
  onClick() {
    this.getGoodsItem(this.data.value) 
  },
})