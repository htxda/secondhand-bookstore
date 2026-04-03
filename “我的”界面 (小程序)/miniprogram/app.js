// app.js
App({
  globalData: {
    userInfo: null,
    statusBarHeight: 20,
    safeAreaBottom: 0
  },

  onLaunch() {
    const sys = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = sys.statusBarHeight
    this.globalData.safeAreaBottom = sys.screenHeight - sys.safeArea.bottom
  }
})
