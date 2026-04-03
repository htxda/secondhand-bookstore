// pages/index/index.js
const app = getApp()

Page({
  data: {
    statusBarHeight: 20,
    scrollHeight: 600,
    safeAreaBottom: 0,
    activeTab: 4,
    progressWidth: 0,

    userInfo: {
      name: '张小书',
      rating: 4.8,
      sold: 12,
      bought: 8,
      collected: 15
    },

    statsData: [
      { value: '12', label: '已卖出', iconType: 'sell' },
      { value: '8',  label: '已买到', iconType: 'buy'  },
      { value: '15', label: '已收藏', iconType: 'heart' }
    ],

    funcData: [
      { label: '我卖出的', iconType: 'sell',    badge: 12 },
      { label: '我买到的', iconType: 'buy',     badge: 8  },
      { label: '我的发布', iconType: 'publish', badge: 5  },
      { label: '我的收藏', iconType: 'heart',   badge: 15 }
    ],

    profileStats: [
      { value: '12',  label: '已卖出' },
      { value: '8',   label: '已买到' },
      { value: '15',  label: '收藏'   },
      { value: '4.8', label: '好评'   }
    ],

    menuItems: [
      { icon: '👤', label: '个人资料', value: '',   last: false },
      { icon: '📍', label: '收货地址', value: '3个', last: false },
      { icon: '❓', label: '帮助中心', value: '',   last: false },
      { icon: '⚙️', label: '设置',     value: '',   last: true  }
    ],

    stars: [true, true, true, true, false]
  },

  onLoad() {
    const sys = wx.getSystemInfoSync()
    const safeAreaBottom = sys.screenHeight - sys.safeArea.bottom
    const navHeight = 82 + safeAreaBottom
    const scrollHeight = sys.windowHeight - navHeight

    this.setData({
      statusBarHeight: sys.statusBarHeight,
      safeAreaBottom: safeAreaBottom,
      scrollHeight: scrollHeight
    })

    // 进度条入场动画：延迟触发让 CSS transition 生效
    setTimeout(() => {
      this.setData({ progressWidth: 75 })
    }, 600)
  },

  // ── 底部导航切换 ──
  onTabChange(e) {
    const tab = parseInt(e.currentTarget.dataset.tab)
    this.setData({ activeTab: tab })
  },

  // ── 核心悬浮按钮 ──
  onCTA() {
    wx.showToast({ title: '发现好书！', icon: 'none' })
  },

  // ── 去浏览书城 ──
  onExplore() {
    wx.showToast({ title: '进入书城', icon: 'none' })
  },

  // ── 微信登录 ──
  onWechatLogin() {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        console.log('登录成功', res)
        wx.showToast({ title: '登录成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '已取消', icon: 'none' })
      }
    })
  },

  // ── 卡片跳转 ──
  onStatTap(e) {
    const type = e.currentTarget.dataset.type
    wx.showToast({ title: type, icon: 'none' })
  },

  onFuncTap(e) {
    const label = e.currentTarget.dataset.label
    wx.showToast({ title: label, icon: 'none' })
  },

  onMenuTap(e) {
    const label = e.currentTarget.dataset.label
    wx.showToast({ title: label, icon: 'none' })
  }
})
