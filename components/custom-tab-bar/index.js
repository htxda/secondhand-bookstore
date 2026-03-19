// components/custom-tab-bar/index.js
Component({
  data: {
    selected: 0
  },
  attached() {
    // 监听页面显示，更新选中状态
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const path = currentPage.route;
    this.updateSelected(path);
  },
  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset;
      wx.switchTab({
        url: path,
        success: () => {
          this.setData({ selected: index });
        }
      });
    },
    updateSelected(path) {
      // 根据当前页面路径更新选中状态
      const pathMap = {
        'pages/index/index': 0,
        'pages/books/books': 1,
        'pages/publish/publish': 2,
        'pages/profile/profile': 3
      };
      const selected = pathMap[path] || 0;
      this.setData({ selected });
    }
  }
});