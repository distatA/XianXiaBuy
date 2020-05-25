// 封装axios请求
// 用一个函数封装并内部返回一个promise对象

// 基地址 
const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'

// 计数器 
let requestCount = 0
const axios = (params) => {
  // 如果url包含/my/就自动添加请求头
    if (params.url.indexOf('/my/') > -1 ) {
      const token = wx.getStorageSync('token')
      if (!token) {
           // 否则跳转去授权
      wx.navigateTo({
        url:'/pages/auth/index'
      })
      }else{
      params.header = { Authorization : token }
    }
    }
  // 请求一次就加
  requestCount ++ ;
  // 发起请求时显示加载状态 
  wx.showNavigationBarLoading();
    
  return new Promise((resolve, reject) => {
    wx.request({
      // 解构出调用axios时传进来的数据 
      ...params,
      // 把传进来的url覆盖了
      // 优化
      url:baseUrl + params.url,
      // 成功调用resolve
      success: (result) => {
        resolve(result);
      },
      // 失败调用reject
      fial: (error) => {
        // 提示 
        wx.showToast({
          title: '数据获取失败',
          icon: 'none',
        });
          
        reject(error);

      },
      // 不管请求成功还是失败,就完成加载 
      complete:()=>{
        // 每次请求完就减
        requestCount --;
        // 计数器等于0 就隐藏 避免首页每次请求完都结束一次,就设置计数器
        if (requestCount === 0) {
        wx.hideNavigationBarLoading();
          
        }
      }
    });
  });
};

// 暴露axios对象出去
export default axios