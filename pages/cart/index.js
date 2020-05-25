// pages/cart/index.js
Page({
  data: {
    cartData: [],
    // 显示隐藏
    block:false,
    // 全选状态 
    allSelect:true,
    // 选中的商品个数,默认为零
    selectCount:0,
    // 总价
    totalPrice:0
   
  },
  cartElseData : {},
 // 大量用到修改视图和修改本地储存所以封装起来
 setContent(cartData){
   let allSelect = false, 
         selectCount = 0,
        totalPrice = 0
  //  循环列表,判断选中的就计算总额
   cartData.forEach(v=>{
     if (v.isSelect) {
      //  让商品数目积累起来 
      selectCount ++;
      totalPrice += v.goods_price * v.count
     }
   })
   if (cartData.length === selectCount) {
         allSelect = true
   }
   
        this.cartElseData = {
          selectCount,
          totalPrice
        }
  wx.setStorageSync('cartData',this.cartElseData)

  // 修改视图
  this.setData({ cartData,totalPrice,selectCount ,allSelect});
  // 修改本地储存
  wx.setStorageSync("cart",cartData);
},
  // 点击切换勾选状态
  handleRadio(e) {
    // 解构出定义好的索引值
    const { index } = e.currentTarget.dataset;
    console.log(index);
    // 获取数据
    let { cartData } = this.data;
    // 根据当前索引值找对对应的对象进行修改状态
    cartData[index].isSelect = !cartData[index].isSelect;
    this.setContent(cartData)
  },
  // 修改数量
  changeNUm(e) {
    // 自定义了number用来分辨加减号,
    const { number, index } = e.currentTarget.dataset;
    const { cartData } = this.data

    if (number === -1) {
      console.log("点击的是减号");
      // 获取到数据
      console.log(index);
    // 如果等于1的时候就提示 
        cartData[index].count -=1
        if (cartData[index].count === 0 ) {
          wx.showModal({
            title: '温馨提示',
            content: '你确定要移除购物车吗?',
            cancelColor:'#000',
            confirmColor:'grey',
            showCancel: true,
            success: ({confirm,cancel}) => {
              // 点击确定就移除 
              if (confirm) {
                console.log('用户点击确定')
                cartData.splice(index,1)
                this.setContent(cartData)
              } else if (cancel) {
               console.log('用户点击取消')
                cartData[index].count = 1
                this.setContent(cartData)
              }
            }
          })
        }
      
    } else {
      // 累加数字 
      cartData[index].count +=1
    }
     this.setContent(cartData)

  },
  //  点击全选切换状态
  handleAllSelect(){
    // 获取到数据
    let { allSelect ,cartData } = this.data 
    // 状态取反
    allSelect = !allSelect;
    // 修改视图 
    this.setData({allSelect})
    console.log(this.data.allSelect);
    // 把全选的状态赋值给每个对象的isSlect
    cartData.forEach(v=>{
      v.isSelect = allSelect
    })

    this.setContent(cartData)
  },
  // 跳转支付页面
  toPay(){
    if (this.data.selectCount === 0) {
      wx.showToast({
        title: '你还没用选择商品哦!',
        icon: 'none',
      });
        
    }else{
      wx.navigateTo({
        url:'/pages/pay/index'
      })
    }
  },
  // 页面显示时
  onShow: function () {
    const cartData = wx.getStorageSync("cart") || [];
    console.log(cartData);
    this.setData({ cartData,block:true });
    this.setContent(cartData)
  },
});
