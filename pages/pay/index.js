import axios from "../../request/axios";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data: {
    // 购物车数据
    cart: [],
    // 数量总价
    cartElseData: [],
    // 现在时间
    dateNow: "",
    // 地址信息 
    address: {},
    // token
    token: "",
    // 订单号
    order_number: "",
    // 被选中的数据
    goods:[]
  },
  async toPay() {
    const { address } = this.data;
    console.log(address);

    // 判断如果地址有填写就跳转
    if (!address.userName) {
      wx.showToast({
        title: "请填写完整地址信息",
        icon: "none",
      });
      return;
    } else {
      // 查看有没有token值
      const token = wx.getStorageSync("token") || "";
      this.setData({ token });
      if (!token) {
        // 否则就跳转
        wx.navigateTo({
          url: "/pages/auth/index",
        });
      } else {
        // 这里需要等结果才可以进行下一步操作,使用async await 同步处理请求
       try {
        const creat = await this.getCreatOrder();
        // 解构出数据
        const { order_number } = creat.data.message;
        const payData = await this.readyPay(order_number);
        console.log();
          const { pay } = payData.data.message;
        const res = await this.weChatPay(pay)
        const payStaus = await this.checkPay(order_number)
        console.log(payStaus);
        this.payProcessed(payStaus)
      
       } catch (error) {
         console.log(error);
         
        wx.showToast({
          title: '支付异常',
          icon: 'none',
        });
       }
      }
    }
  },
  // 获取通讯地址
  getUserAddress() {
    // 取用户当前的授权状态
    wx.getSetting({
      // 把数据解构出来,根据这个对象里面的值判断用户是否拒绝了获取地址信息,拒绝了下次直接打开设置,反之正常运行
      success: ({ authSetting }) => {
        const scopedAddress = authSetting["scope.address"];
        // console.log("地址获取状态是", scopedAddress);
        // 结果是undefined和true
        if (scopedAddress === undefined || scopedAddress === true) {
          // 获取用户收货地址
          wx.chooseAddress({
            success: (res) => {
              // console.log(res);
              const {
                userName,
                telNumber,
                provinceName,
                cityName,
                countyName,
                detailInfo,
              } = res;
              let address = {
                userName,
                telNumber,
                addressDetail:
                  provinceName + cityName + countyName + detailInfo,
              };
              console.log(address);
              // 保存到本地储存
              wx.setStorageSync("address", address);
              this.setData({ address });
            },
          });
        } else {
          wx.showToast({
            title: "请授权信息",
            icon: "none",
          });
          wx.openSetting({
            success: (res) => {
              // console.log(res)
            },
          });
        }
      },
    });
  },
  // 创建订单
  getCreatOrder() {
    // 获取到商品价格数量数据,地址信息,token,被选中的商品信息
    const { cartElseData, address, token, cart } = this.data;

    // console.log('商品总价'+cartElseData.totalPrice,'地址信息'+address.addressDetail);
    // 使用箭头返回函数对象时要在小括号
    const goods = cart
      .filter((item) => item.isSelect)
      .map((v) => ({
        goods_id: v.goods_id,
        goods_number: v.count,
        goods_price: v.goods_price,
      }));
    // console.log(goods,token);
    this.data.goods = goods
    this.setData({goods :goods })
    return axios({
      url: "/my/orders/create",
      method: "post",
      data: {
        order_price: cartElseData.totalPrice,
        consignee_addr: address.addressDetail,
        goods,
      },
    });
  },
  // 获取支付pay
  readyPay(order_number) {
    return axios({
      url: "/my/orders/req_unifiedorder",
      method: "POST",
     
      data: { order_number },
    })
  },
// 微信支付
  weChatPay(pya) {
    return new Promise((resolve,reject)=>{
      wx.requestPayment({
        ...pya,
        success (res) {
          resolve(res)
         },
        fail (res) { 
          reject(res)
        }
      })
    })
  },
  // 查看支付状态
  checkPay(order_number){
      return axios({
        url:'/my/orders/chkOrder',
        method:'POST',
      
       data :{order_number}
      })
  },
  payProcessed(payStaus){
    if (payStaus.data.message === '支付成功') {
      wx.showToast({
        title: '支付成功',
        icon: 'none',
      });
    
    // 把没被选中的重新保存到本地,间接的吧选中了商品清除了
     const newCart = this.data.cart.filter((item) => !item. isSelect)
    wx.setStorageSync('cart',newCart)
    }
      // 调到订单页
      wx.redirectTo({
        url: '/pages/order/index',
      });
  },
  onShow: function () {
    const cart = wx.getStorageSync("cart") || [];
    // 获取购物车的价格等数据
    const cartElseData = wx.getStorageSync("cartData") || [];
    // 获取地址
    const address = wx.getStorageSync("address") || [];
    // 获取日期
    var now = new Date();
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let dateNow = `${year}年-${month}月-${day}日`;
    this.setData({ cart, cartElseData, dateNow, address });
  },

});
