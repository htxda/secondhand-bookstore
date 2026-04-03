// 书籍详情页逻辑 - 高级交互优化版
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 页面加载状态
    pageLoaded: false,
    showLoading: false,
    loading: true,
    error: false,
    
    // 头部状态
    headerOpacity: 1,
    headerTransform: 0,
    
    // 按钮按压状态
    backBtnPressed: false,
    favBtnPressed: false,
    serviceBtnPressed: false,
    cartBtnPressed: false,
    addCartBtnPressed: false,
    buyBtnPressed: false,
    expandBtnPressed: false,
    
    // 波纹效果
    addCartRipple: false,
    buyRipple: false,
    
    // 图片加载状态
    imageLoaded: [false, false, false],
    
    // Toast 状态
    toastShow: false,
    toastMessage: '',
    toastIcon: '✓',
    
    // 底部栏状态
    bottomBarShow: false,
    cartCount: 0,
    
    // 书籍图片列表
    bookImages: [],
    currentImageIndex: 0,
    isFavorite: false,
    isExpanded: false,
    detailsCollapsed: false,
    
    // 销量数据
    salesCount: '1.2k',

    // 书籍ID
    bookId: '',
    
    // 书籍基本信息
    bookInfo: {
      title: '',
      subtitle: '',
      price: '',
      originalPrice: '',
      rating: '4.8',
      description: ''
    },

    // 作者信息
    authorInfo: {
      name: '',
      title: '',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
    },

    // 书籍详情
    bookDetails: [
      { label: '出版社', value: '未知' },
      { label: '出版时间', value: '未知' },
      { label: 'ISBN', value: '未知' },
      { label: '页数', value: '未知' },
      { label: '装帧', value: '未知' },
      { label: '开本', value: '未知' }
    ],

    // 推荐书籍
    recommendBooks: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const bookId = options.id;
    console.log('加载书籍详情，ID:', bookId);
    
    if (bookId) {
      // 根据 bookId 请求后端数据
      this.loadBookDetail(bookId);
    } else {
      this.setData({
        loading: false,
        error: true
      });
    }
    
    // 延迟显示页面，增加淡入效果
    setTimeout(() => {
      this.setData({ 
        pageLoaded: true,
        bottomBarShow: true 
      });
    }, 100);
    

    
    // 模拟加载购物车数量
    this.loadCartCount();
  },

  /**
   * 加载书籍详情
   */
  loadBookDetail(bookId) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    
    wx.cloud.callFunction({
      name: 'book',
      data: {
        action: 'getDetail',
        bookId: bookId
      }
    }).then(res => {
      wx.hideLoading();
      console.log('获取书籍详情成功:', res);
      
      if (res.result.success) {
        const bookData = res.result.data;
        console.log('书籍数据:', bookData);
        console.log('图片字段:', bookData.images);
        
        // 处理书籍图片（数据库中images字段是数组）
        let bookImages = [];
        if (bookData.images && bookData.images.length > 0) {
          bookImages = bookData.images;
        } else if (bookData.image) {
          // 兼容旧数据，image字段是单个图片URL
          bookImages.push(bookData.image);
        }
        console.log('图片数组:', bookImages);
        
        // 构建页面数据（先设置基本数据）
        this.setData({
          bookId: bookId,
          bookImages: bookImages,
          bookInfo: {
            title: bookData.title || '未知标题',
            subtitle: bookData.author || '',
            price: bookData.price || '0',
            originalPrice: bookData.originalPrice || '',
            rating: '4.8',
            description: bookData.description || '暂无描述'
          },
          authorInfo: {
            name: bookData.author || '未知作者',
            title: '作者',
            bio: '',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
          },
          bookDetails: [
            { label: '出版社', value: '未知' },
            { label: '出版时间', value: '未知' },
            { label: 'ISBN', value: '未知' },
            { label: '页数', value: '未知' },
            { label: '装帧', value: bookData.condition || '未知' },
            { label: '分类', value: bookData.subject || '未知' }
          ],
          loading: false,
          error: false
        });
        
        // 获取云存储图片的临时链接
        if (bookImages.length > 0) {
          const cloudPaths = bookImages.filter(url => url.startsWith('cloud://'));
          
          if (cloudPaths.length > 0) {
            wx.cloud.getTempFileURL({
              fileList: cloudPaths,
              success: tempRes => {
                const tempUrls = tempRes.fileList.map(item => item.tempFileURL);
                const httpUrls = bookImages.filter(url => !url.startsWith('cloud://'));
                this.setData({
                  bookImages: [...httpUrls, ...tempUrls]
                });
              },
              fail: err => {
                console.error('获取临时链接失败:', err);
              }
            });
          }
        }
        
        // 获取推荐书籍
        const recommendCategory = bookData.category || bookData.subject || '';
        if (recommendCategory) {
          this.loadRecommendBooks(recommendCategory);
        }
      } else {
        this.setData({
          loading: false,
          error: true
        });
        this.showToast(res.result.message || '加载失败', '⚠️');
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('获取书籍详情失败:', err);
      this.setData({
        loading: false,
        error: true
      });
      this.showToast('网络错误，请重试', '⚠️');
    });
  },

  /**
   * 加载推荐书籍
   */
  loadRecommendBooks(category) {
    wx.cloud.callFunction({
      name: 'book',
      data: {
        action: 'getList',
        category: category,
        limit: 4
      }
    }).then(res => {
      console.log('获取推荐书籍成功:', res);
      
      if (res.result.success) {
        const recommendBooks = res.result.data.map(book => ({
          id: book._id,
          title: book.title,
          price: book.price,
          cover: book.image,
          tag: Math.random() > 0.5 ? '热销' : ''
        }));
        
        this.setData({
          recommendBooks: recommendBooks
        });
      }
    }).catch(err => {
      console.error('获取推荐书籍失败:', err);
    });
  },

  /**
   * 加载购物车数量
   */
  loadCartCount() {
    // 从本地存储或全局状态获取购物车数量
    const cartCount = wx.getStorageSync('cartCount') || 0;
    this.setData({ cartCount });
  },

  /**
   * 图片加载完成
   */
  onImageLoad(e) {
    const index = e.currentTarget.dataset.index;
    const imageLoaded = this.data.imageLoaded;
    imageLoaded[index] = true;
    this.setData({ imageLoaded });
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: this.data.bookImages,
      current: src
    });
  },

  /**
   * 轮播图切换
   */
  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  /**
   * 返回按钮交互
   */
  onBackBtnPress() {
    this.setData({ backBtnPressed: true });
  },
  
  onBackBtnRelease() {
    this.setData({ backBtnPressed: false });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  /**
   * 收藏按钮交互
   */
  onFavBtnPress() {
    this.setData({ favBtnPressed: true });
  },
  
  onFavBtnRelease() {
    this.setData({ favBtnPressed: false });
  },

  toggleFavorite() {
    const isFavorite = !this.data.isFavorite;
    this.setData({ isFavorite });
    
    this.showToast(isFavorite ? '已收藏' : '已取消收藏', '♥');
  },

  /**
   * 展开详情
   */
  toggleDetails() {
    this.setData({
      detailsCollapsed: !this.data.detailsCollapsed
    });
  },

  /**
   * 展开简介按钮交互
   */
  onExpandBtnPress() {
    this.setData({ expandBtnPressed: true });
  },
  
  onExpandBtnRelease() {
    this.setData({ expandBtnPressed: false });
  },

  toggleDescription() {
    this.setData({
      isExpanded: !this.data.isExpanded
    });
  },

  /**
   * 查看作者详情
   */
  viewAuthorDetail() {
    this.showToast('作者详情开发中', '👤');
  },

  /**
   * 查看推荐书籍
   */
  viewBook(e) {
    const bookId = e.currentTarget.dataset.id;
    
    // 显示加载动画
    this.setData({ showLoading: true });
    
    setTimeout(() => {
      this.setData({ showLoading: false });
      // 跳转到书籍详情
      wx.navigateTo({
        url: `/packageA/pages/bookDetail/bookDetail?id=${bookId}`
      });
    }, 500);
  },

  /**
   * 查看更多推荐
   */
  viewMoreRecommend() {
    this.showToast('查看更多推荐', '📚');
  },

  /**
   * 快速加入购物车
   */
  quickAddToCart(e) {
    const bookId = e.currentTarget.dataset.id;
    
    if (!bookId) {
      this.showToast('书籍信息错误', '⚠️');
      return;
    }
    
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再加入购物车',
        confirmText: '去登录',
        confirmColor: '#FF8FA3',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }
        }
      });
      return;
    }
    
    wx.showLoading({ title: '加入中...' });
    
    wx.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'add',
        data: { bookId: bookId }
      }
    }).then(res => {
      wx.hideLoading();
      
      if (res.result && res.result.success) {
        const cartCount = this.data.cartCount + 1;
        this.setData({ cartCount });
        wx.setStorageSync('cartCount', cartCount);
        this.showToast('已加入购物车', '🛒');
      } else if (res.result && res.result.needLogin) {
        wx.showModal({
          title: '提示',
          content: '请先登录后再加入购物车',
          confirmText: '去登录',
          confirmColor: '#FF8FA3',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.switchTab({
                url: '/pages/profile/profile'
              });
            }
          }
        });
      } else {
        this.showToast(res.result.message || '加入失败', '⚠️');
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('快速加入购物车失败:', err);
      this.showToast('网络错误，请重试', '⚠️');
    });
  },

  /**
   * 客服按钮交互
   */
  onServiceBtnPress() {
    this.setData({ serviceBtnPressed: true });
  },
  
  onServiceBtnRelease() {
    this.setData({ serviceBtnPressed: false });
  },

  contactService() {
    this.showToast('正在连接客服', '💬');
  },

  /**
   * 购物车按钮交互
   */
  onCartBtnPress() {
    this.setData({ cartBtnPressed: true });
  },
  
  onCartBtnRelease() {
    this.setData({ cartBtnPressed: false });
  },

  navigateToCart() {
    this.showToast('跳转到购物车', '🛒');
  },

  /**
   * 加入购物车按钮交互
   */
  onAddCartPress() {
    this.setData({ 
      addCartBtnPressed: true,
      addCartRipple: true
    });
    
    setTimeout(() => {
      this.setData({ addCartRipple: false });
    }, 600);
  },
  
  onAddCartRelease() {
    this.setData({ addCartBtnPressed: false });
  },

  addToCart() {
    const bookId = this.data.bookId;
    
    if (!bookId) {
      this.showToast('书籍信息错误', '⚠️');
      return;
    }
    
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再加入购物车',
        confirmText: '去登录',
        confirmColor: '#FF8FA3',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }
        }
      });
      return;
    }
    
    wx.showLoading({ title: '加入中...' });
    
    wx.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'add',
        data: { bookId: bookId }
      }
    }).then(res => {
      wx.hideLoading();
      console.log('加入购物车结果:', res);
      
      if (res.result && res.result.success) {
        const cartCount = this.data.cartCount + 1;
        this.setData({ cartCount });
        wx.setStorageSync('cartCount', cartCount);
        this.showToast('已加入购物车', '🛒');
      } else if (res.result && res.result.needLogin) {
        wx.showModal({
          title: '提示',
          content: '请先登录后再加入购物车',
          confirmText: '去登录',
          confirmColor: '#FF8FA3',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.switchTab({
                url: '/pages/profile/profile'
              });
            }
          }
        });
      } else {
        this.showToast(res.result.message || '加入失败', '⚠️');
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('加入购物车失败:', err);
      this.showToast('网络错误，请重试', '⚠️');
    });
  },

  /**
   * 立即购买按钮交互
   */
  onBuyPress() {
    this.setData({ 
      buyBtnPressed: true,
      buyRipple: true
    });
    
    setTimeout(() => {
      this.setData({ buyRipple: false });
    }, 600);
  },
  
  onBuyRelease() {
    this.setData({ buyBtnPressed: false });
  },

  buyNow() {
    // 显示加载
    this.setData({ showLoading: true });
    
    setTimeout(() => {
      this.setData({ showLoading: false });
      this.showToast('跳转到订单确认', '✓');
      
      // 实际项目中跳转到订单页面
      // wx.navigateTo({
      //   url: '/pages/order-confirm/order-confirm'
      // });
    }, 800);
  },

  /**
   * 显示 Toast 提示
   */
  showToast(message, icon = '✓') {
    this.setData({
      toastMessage: message,
      toastIcon: icon,
      toastShow: true
    });
    
    setTimeout(() => {
      this.setData({ toastShow: false });
      setTimeout(() => {
        this.setData({ toastMessage: '' });
      }, 300);
    }, 2000);
  },

  /**
   * 页面滚动监听
   */
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    
    // 保持头部始终可见，不随滚动隐藏
    this.setData({
      headerOpacity: 1,
      headerTransform: 0
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
      this.showToast('刷新成功', '✓');
    }, 1000);
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {
    return {
      title: this.data.bookInfo.title,
      path: `/packageA/pages/bookDetail/bookDetail?id=${this.data.bookInfo.id || 1}`,
      imageUrl: this.data.bookImages[0]
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: this.data.bookInfo.title,
      query: `id=${this.data.bookInfo.id || 1}`,
      imageUrl: this.data.bookImages[0]
    };
  },

  /**
   * 页面显示
   */
  onShow() {
    // 刷新购物车数量
    this.loadCartCount();
  },

  /**
   * 重新加载页面
   */
  reloadPage() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;
    
    this.setData({
      loading: true,
      error: false
    });
    
    if (options.id) {
      this.loadBookDetail(options.id);
    }
  }
});