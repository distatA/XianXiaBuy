import axios from "../../request/axios"
Page({
  data: {
  },
  params:{},
  // 需要用户授权,拿到用户信息
  getUserInfo(e){
    const { encryptedData, signature, iv , rawData}  = e.detail
    // 但提前要拿到code给后端服务器才可以生成token 拿到code要调用微信小程序的接口 
    wx.login({
      // 解构出来
      success: ({code}) =>{
       this.params = {code,signature,iv,rawData,encryptedData}
      //  请求拿到token
        this.getToken()
      }
    })
  },
  // 获取token值
  getToken(){
    axios({
      url:'/users/wxlogin',
      method:'POST',
       data: this.params
    }).then(res=>{
      // console.log(res);
      // 拿到token值,存到本地
      const { token } = res.data.message 
      if (token) {
        wx.navigateTo({
          url: '/pages/pay/index'
        })
        wx.showToast({
          title: '授权成功',
          icon: 'none',
        });
      }
      // console.log(token);
      wx.setStorageSync('token', token);
    })
  },
})