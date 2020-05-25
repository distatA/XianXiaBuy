// pages/user/index.js
Page({


  data: {
    // 导航栏
    nav:[
      { class:'iconorder',value:'全部订单' ,id:0},
      { class:'icondaifukuan',value:'待付款',id:1},
      { class:'icondaifahuo',value:'待发货',id:2},
      { class:'icondaishouhuo',value:'待收货',id:3},
      { class:'iconshouhou1',value:'售后',id:4}
    ],
    // 管理更多
    manage:[
      {class:'iconicon-test',value:'我也开店',},
      {class:'iconshoucang',value:'我的收藏'},
      {class:'icontuikuan',value:'退款/退货'},
      {class:'icondizhi1',value:'地址管理'},
      {class:'iconlianxikefu',value:'联系客服'},
      {class:'iconqiandao',value:'签到'},
      {class:'iconjiameng',value:'加盟'},
      {class:'iconhuiyuan',value:'会员'},
      {class:'iconmimasuo',value:'修改密码'},
      {class:'iconV',value:'卖二手货'},

    ]
  },
  // 跳转订单页
  toOrder(e){
      const { index } = e.currentTarget.dataset
      if (index ===0) {
        wx.navigateTo({
          url: '/pages/order/index',
        });
          
      }
      
  }

 
})