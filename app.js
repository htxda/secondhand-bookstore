// app.js
App({
  onLaunch() {
    // 小程序启动时的逻辑
    console.log('App launched');

    // 初始化 CloudBase
    wx.cloud.init({
      env: 'cloud1-4gs0hrcj33e136f8', // 请替换为你的 CloudBase 环境 ID
      traceUser: true // 记录用户访问
    });

    // 检查用户登录状态
    this.checkLoginStatus();
  },

  // 检查用户登录状态
  checkLoginStatus() {
    const openid = wx.getStorageSync('openid');
    if (openid) {
      this.globalData.openid = openid;
      this.globalData.userInfo = {
        openid: openid,
        isLoggedIn: true
      };
      console.log('用户已登录:', openid);
    }
  },

  globalData: {
    openid: null,
    userInfo: null,
    searchKeyword: ''
  }
});