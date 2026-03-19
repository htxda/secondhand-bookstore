Component({
    data: {
      selected: 0,
      color: "#9ca3af",
      selectedColor: "#FF8FA3",
      list: [
        { pagePath: "/pages/index/index", text: "首页" },
        { pagePath: "/pages/books/books", text: "书籍" },
        { pagePath: "/pages/publish/publish", text: "发布" },
        { pagePath: "/pages/cart/cart", text: "购物车" }, // 对应图片中的关注
        { pagePath: "/pages/profile/profile", text: "我的" }  // 对应图片中的我
      ]
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset
        const url = data.path
        const index = data.index
        
        // 更新选中状态
        this.setData({ selected: index })
        
        wx.switchTab({ 
          url: url,
          success: () => {
            // 成功切换后再更新选中状态
            this.setData({ selected: index })
          },
          fail: (err) => {
            console.error('页面跳转失败:', err)
          }
        })
      }
    }
  })