import axios from "../../request/axios"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    active: 0,
    tabList:[
      { value:'全部',id:'1' ,content:'订单'},
      { value:'待付款',id:'2' ,content:'付款'},
      { value:'代发货',id:'3' ,content:'发货'},
    ],
  },
  onLoad:function () {
    axios({
      url:'/my/orders/all',
      data:{
        type:1
      }
    }).then(res=>{
      console.log(res);
      const { orders } = res.data.message
      orders.map(v=>v.create_time = new Date(v.create_time*1000).toLocaleString().replace('上午', '')
      )
      this.setData({orders})
      
    })

    }
})