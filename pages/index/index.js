// index.js
Page({
    data: {
      title: '二手书小程序',
      searchKeyword: '',
      // ... 原有的 data 保持不变 ...
      cartButtonTop: null,
      cartButtonBottom: '120rpx',
      cartButtonLeft: null,
      cartButtonRight: '32rpx',
      startX: 0,
      startY: 0,
      isDragging: false,
      cartCount: 0,
      categories: [
        { id: "math", name: "数学", emoji: "📐", color: "bg-blue-100" },
        { id: "english", name: "英语", emoji: "📚", color: "bg-green-100" },
        { id: "computer", name: "计算机", emoji: "💻", color: "bg-purple-100" },
        { id: "physics", name: "物理", emoji: "⚡", color: "bg-yellow-100" },
        { id: "chemistry", name: "化学", emoji: "🧪", color: "bg-pink-100" },
        { id: "economics", name: "经济", emoji: "💰", color: "bg-orange-100" },
        { id: "literature", name: "文学", emoji: "📖", color: "bg-red-100" },
        { id: "other", name: "其他", emoji: "📦", color: "bg-gray-100" }
      ],
      featuredBooks: [],
      imageUrls: []
    },
    
    onLoad() {
      console.log('Index page loaded');
      this.loadFeaturedBooks();
    },
  
    onShow() {
      // 1. 原有的重新加载逻辑
      this.loadFeaturedBooks();
      
      // 2. 【核心修改】同步自定义 TabBar 的选中索引 (首页为 0)
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      
      // 3. 加载购物车数量
      this.loadCartCount();
    },
    
    // 加载购物车数量
    loadCartCount() {
      const db = wx.cloud.database();
      const _ = db.command;
      
      // 获取当前用户的 openid
      const openid = wx.getStorageSync('openid');
      
      if (!openid) {
        console.log('用户未登录，无法获取购物车数量');
        return;
      }
      
      db.collection('cart')
        .where({
          _openid: openid
        })
        .count()
        .then(res => {
          this.setData({
            cartCount: res.total || 0
          });
        })
        .catch(err => {
          console.error('加载购物车数量失败:', err);
        });
    },
  
    // ... 后面所有的 loadFeaturedBooks, browseBooks, publishBook, touchMove 等原有函数均保持不变 ...
    loadFeaturedBooks() {
      wx.showLoading({ title: '加载中...' });
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('books')
        .where({ status: 'available' })
        .orderBy('createTime', 'desc')
        .limit(3)
        .get()
        .then(res => {
          wx.hideLoading();
          const books = res.data || [];
          const imageUrls = books.map(book => {
            if (book.images && book.images.length > 0) return book.images[0];
            else if (book.image) return book.image;
            return '';
          });
          this.setData({ featuredBooks: books, imageUrls: imageUrls });
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({ title: '加载失败,请重试', icon: 'none' });
        });
    },
    browseBooks() { wx.switchTab({ url: '/pages/books/books' }); },
    publishBook() { wx.switchTab({ url: '/pages/publish/publish' }); },
    categoryTap(e) { 
      const categoryId = e.currentTarget.dataset.id;
      wx.navigateTo({ url: `/pages/books/books?category=${categoryId}` }); 
    },
    bookTap(e) {
      const bookId = e.currentTarget.dataset.id;
      if (!bookId) return;
      wx.navigateTo({ url: `/pages/bookDetail/bookDetail?id=${bookId}` });
    },
    viewMoreBooks() { wx.switchTab({ url: '/pages/books/books' }); },
    // 搜索输入事件
    searchInput(e) {
      const keyword = e.detail.value.trim();
      this.setData({
        searchKeyword: keyword
      });
    },
    // 搜索确认事件
    onSearchConfirm() {
      const keyword = this.data.searchKeyword || '';
      if (keyword.trim()) {
        // 有输入内容时，保存关键词并跳转到书籍页面
        wx.setStorageSync('searchKeyword', keyword);
        wx.switchTab({
          url: '/pages/books/books'
        });
      } else {
        // 没有输入内容时，只显示交互效果，不跳转
        console.log('没有输入搜索内容');
      }
    },
    goToCart() { 
      if (!this.data.isDragging) { 
        wx.switchTab({ 
          url: '/pages/cart/cart' 
        }); 
      } 
    },
    touchStart(e) {
      wx.getSystemInfo({ success: (res) => { this.screenInfo = { width: res.windowWidth, height: res.windowHeight }; } });
      this.setData({ startX: e.touches[0].clientX, startY: e.touches[0].clientY, isDragging: false });
    },
    touchMove(e) {
      const moveX = e.touches[0].clientX;
      const moveY = e.touches[0].clientY;
      this.setData({ isDragging: true });
      const screenWidth = this.screenInfo ? this.screenInfo.width : 375;
      const screenHeight = this.screenInfo ? this.screenInfo.height : 667;
      const buttonWidth = 96;
      let newX = moveX - buttonWidth / 2;
      let newY = moveY - buttonWidth / 2;
      newX = Math.max(0, Math.min(newX, screenWidth - buttonWidth));
      newY = Math.max(0, Math.min(newY, screenHeight - buttonWidth));
      this.setData({
        cartButtonLeft: newX + 'px',
        cartButtonTop: newY + 'px',
        cartButtonRight: null,
        cartButtonBottom: null,
        startX: moveX,
        startY: moveY
      });
    },
    touchEnd(e) {
      if (this.screenInfo) {
        const screenWidth = this.screenInfo.width;
        const buttonWidth = 96;
        const lastX = this.data.startX;
        const lastY = this.data.startY;
        let snapX = lastX < screenWidth / 2 ? 0 : screenWidth - buttonWidth;  // 修复错误的计算
        let snapY = Math.max(0, Math.min(lastY - buttonWidth / 2, this.screenInfo.height - buttonWidth));
        this.setData({
          cartButtonLeft: snapX + 'px',
          cartButtonTop: snapY + 'px',
          cartButtonRight: null,
          cartButtonBottom: null
        });
      }
      this.setData({ isDragging: false });
    }
  });