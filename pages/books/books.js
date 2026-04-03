// books.js
Page({
  data: {
    cartButtonTop: null,
    cartButtonBottom: '120rpx',
    cartButtonLeft: null,
    cartButtonRight: '32rpx',
    startX: 0,
    startY: 0,
    isDragging: false,
    // 所有书籍数据
    allBooks: [],
    // 当前显示的书籍（搜索或筛选后）
    books: [],
    selectedCategory: null,
    searchKeyword: "",
    isSearching: false,
    cartCount: 0
  },
  onLoad(options) {
    console.log('Books page loaded', options);

    // 加载所有书籍
    this.loadBooks();
    this.loadCartCount();

    // 处理分类筛选
    if (options.category) {
      this.setData({
        selectedCategory: options.category
      });
    }

    // 处理搜索关键词（从首页搜索跳转过来）
    if (options.keyword) {
      const keyword = decodeURIComponent(options.keyword);
      this.setData({
        searchKeyword: keyword
      });
      this.doSearch(keyword);
    } else {
      // 从缓存中读取搜索关键词（来自首页搜索）
      const searchKeyword = wx.getStorageSync('searchKeyword');
      if (searchKeyword) {
        this.setData({
          searchKeyword: searchKeyword
        });
        this.doSearch(searchKeyword);
        // 清除缓存，避免重复使用
        wx.removeStorageSync('searchKeyword');
      }
    }
  },
  onShow() {
    // 页面显示时重新加载书籍和购物车数量
    this.loadBooks();
    this.loadCartCount();
    
    // 设置自定义TabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1  // 书籍在tabBar列表中是第2个，索引为1
      });
    }
  },
  // 加载所有书籍
  loadBooks() {
    wx.showLoading({ title: '加载中...' });

    // 直接使用云数据库查询
    const db = wx.cloud.database();
    const _ = db.command;

    db.collection('books')
      .where({
        status: 'available'
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        wx.hideLoading();

        const books = res.data || [];
        this.setData({
          allBooks: books,
          books: books
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载书籍失败:', err);
        wx.showToast({
          title: '加载失败,请重试',
          icon: 'none'
        });
      });
  },
  // 书籍点击事件
  bookTap(e) {
    const bookId = e.currentTarget.dataset.id;
    console.log('books.js - bookTap called, bookId:', bookId);
    console.log('event:', e);
    console.log('dataset:', e.currentTarget.dataset);

    if (!bookId) {
      console.error('bookId is undefined!');
      wx.showToast({
        title: '书籍ID获取失败',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/packageA/pages/bookDetail/bookDetail?id=${bookId}`,
      success: () => {
        console.log('跳转到书籍详情页成功, bookId:', bookId);
      },
      fail: (err) => {
        console.error('跳转失败:', err);
      }
    });
  },
  // 搜索输入事件 - 实时搜索
  searchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({
      searchKeyword: keyword
    });
    this.doSearch(keyword);
  },
  // 搜索提交事件
  searchSubmit() {
    const keyword = this.data.searchKeyword.trim();
    this.doSearch(keyword);
  },
  // 执行搜索
  doSearch(keyword) {
    const db = wx.cloud.database();
    const _ = db.command;

    // 如果有关键词，从数据库搜索
    if (keyword && keyword.length > 0) {
      wx.showLoading({ title: '搜索中...' });

      db.collection('books')
        .where(_.and([
          { status: 'available' },
          _.or([
            {
              title: db.RegExp({
                regexp: keyword,
                options: 'i'
              })
            },
            {
              author: db.RegExp({
                regexp: keyword,
                options: 'i'
              })
            },
            {
              category: db.RegExp({
                regexp: keyword,
                options: 'i'
              })
            }
          ])
        ]))
        .orderBy('createTime', 'desc')
        .get()
        .then(res => {
          wx.hideLoading();

          const books = res.data || [];
          this.setData({
            books: books,
            isSearching: true
          });

          // 显示搜索结果提示
          if (books.length === 0) {
            wx.showToast({
              title: '未找到相关书籍',
              icon: 'none',
              duration: 1500
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.error('搜索失败:', err);
        });
    } else {
      // 如果没有关键词，按分类筛选或显示全部
      if (this.data.selectedCategory) {
        this.filterByCategory(this.data.selectedCategory);
      } else {
        this.setData({
          books: this.data.allBooks,
          isSearching: false
        });
      }
    }
  },
  // 按分类筛选
  filterByCategory(category) {
    const db = wx.cloud.database();

    if (category) {
      wx.showLoading({ title: '加载中...' });

      const categoryName = this.getCategoryName(category);

      db.collection('books')
        .where({
          status: 'available',
          category: categoryName
        })
        .orderBy('createTime', 'desc')
        .get()
        .then(res => {
          wx.hideLoading();

          const books = res.data || [];
          this.setData({
            books: books,
            selectedCategory: category
          });
        })
        .catch(err => {
          wx.hideLoading();
          console.error('加载分类书籍失败:', err);
        });
    } else {
      this.setData({
        books: this.data.allBooks,
        selectedCategory: category
      });
    }
  },
  // 获取分类名称
  getCategoryName(categoryId) {
    const categoryMap = {
      'math': '数学',
      'english': '英语',
      'computer': '计算机',
      'physics': '物理',
      'chemistry': '化学',
      'economics': '经济',
      'literature': '文学',
      'other': '其他'
    };
    return categoryMap[categoryId] || categoryId;
  },
  // 跳转到购物车
  goToCart() {
    if (!this.data.isDragging) {
      wx.switchTab({
        url: '/pages/cart/cart'
      });
    }
  },
  // 触摸开始事件
  touchStart(e) {
    wx.getSystemInfo({
      success: (res) => {
        this.screenInfo = {
          width: res.windowWidth,
          height: res.windowHeight
        };
      }
    });

    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      isDragging: false
    });
  },
  // 触摸移动事件
  touchMove(e) {
    const moveX = e.touches[0].clientX;
    const moveY = e.touches[0].clientY;

    this.setData({ isDragging: true });

    const screenWidth = this.screenInfo ? this.screenInfo.width : 375;
    const screenHeight = this.screenInfo ? this.screenInfo.height : 667;
    const buttonWidth = 96;
    const buttonHeight = 96;

    let newX = moveX - buttonWidth / 2;
    let newY = moveY - buttonHeight / 2;

    newX = Math.max(0, Math.min(newX, screenWidth - buttonWidth));
    newY = Math.max(0, Math.min(newY, screenHeight - buttonHeight));

    this.setData({
      cartButtonLeft: newX + 'px',
      cartButtonTop: newY + 'px',
      cartButtonRight: null,
      cartButtonBottom: null,
      startX: moveX,
      startY: moveY
    });
  },
  // 触摸结束事件
  touchEnd(e) {
    if (this.screenInfo) {
      const screenWidth = this.screenInfo.width;
      const buttonWidth = 96;
      const lastX = this.data.startX;
      const lastY = this.data.startY;

      let snapX;
      if (lastX < screenWidth / 2) {
        snapX = 0;
      } else {
        snapX = screenWidth - buttonWidth;
      }

      let snapY = lastY - buttonWidth / 2;
      snapY = Math.max(0, Math.min(snapY, this.screenInfo.height - buttonWidth));

      this.setData({
        cartButtonLeft: snapX + 'px',
        cartButtonTop: snapY + 'px',
        cartButtonRight: null,
        cartButtonBottom: null
      });
    }

    this.setData({ isDragging: false });
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
  }
});