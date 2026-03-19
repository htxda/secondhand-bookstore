// bookDetail.js
Page({
  data: {
    cartButtonTop: null,
    cartButtonBottom: '120rpx',
    cartButtonLeft: null,
    cartButtonRight: '32rpx',
    startX: 0,
    startY: 0,
    isDragging: false,
    book: {},
    imageUrls: [],
    currentImageIndex: 0,
    _openid: '',
    cartCount: 0
  },
  onLoad(options) {
    console.log('BookDetail page loaded, options:', options);
    const bookId = options.id;
    console.log('bookId:', bookId, 'type:', typeof bookId, 'length:', bookId ? bookId.length : 0);

    if (bookId) {
      this.loadBookDetail(bookId);
      this.loadCartCount();
    } else {
      console.error('bookId is empty or undefined');
      wx.showToast({
        title: '书籍ID不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  onShow() {
    // 每次显示页面时重新加载购物车数量
    this.loadCartCount();
  },
  // 加载购物车数量
  loadCartCount() {
    // 使用云函数获取购物车数量
    wx.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'getCount'
      }
    }).then(res => {
      console.log('购物车数量:', res);
      if (res.result && res.result.success) {
        this.setData({
          cartCount: res.result.count || 0
        });
      }
    }).catch(err => {
      console.error('加载购物车数量失败:', err);
    });
  },
  // 加载书籍详情
  loadBookDetail(bookId) {
    console.log('开始加载书籍详情, bookId:', bookId);
    wx.showLoading({ title: '加载中...' });

    // 直接使用云数据库查询
    const db = wx.cloud.database();

    db.collection('books')
      .doc(bookId)
      .get()
      .then(res => {
        console.log('数据库查询成功, res:', res);
        wx.hideLoading();

        if (res.data) {
          const book = res.data;
          // 处理图片字段,可能是 image 或 images
          let imageUrls = [];
          if (book.images && book.images.length > 0) {
            imageUrls = book.images;
          } else if (book.image) {
            imageUrls = [book.image];
          }

          // 如果都没有图片,使用默认图片
          if (imageUrls.length === 0) {
            imageUrls = [
              'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'
            ];
          }

          this.setData({
            book: book,
            imageUrls: imageUrls,
            _openid: book._openid || ''
          });

          console.log('书籍详情加载成功:', book);
        } else {
          console.error('书籍数据为空');
          wx.showToast({
            title: '书籍不存在或已被下架',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载书籍详情失败:', err);
        console.error('错误详情:', err.errCode, err.errMsg);
        wx.showToast({
          title: '加载失败:' + (err.errMsg || '请重试'),
          icon: 'none',
          duration: 3000
        });
      });
  },
  // 切换图片
  switchImage(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentImageIndex: index });
  },
  // 联系卖家
  contactSeller() {
    const book = this.data.book;
    wx.showModal({
      title: '联系卖家',
      content: '卖家微信号: bookstore_' + (this.data._openid ? this.data._openid.substring(0, 6) : 'user'),
      confirmText: '复制',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'bookstore_' + (this.data._openid ? this.data._openid.substring(0, 6) : 'user'),
            success: () => {
              wx.showToast({
                title: '已复制微信号',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },
  // 收藏书籍
  favoriteBook() {
    wx.showToast({
      title: '收藏功能开发中',
      icon: 'none'
    });
  },
  // 添加到购物车
  addToCart() {
    const app = getApp();
    // 优先从 globalData 获取，否则从本地存储获取
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    const book = this.data.book;
    
    console.log('addToCart openid:', openid);

    if (!book || !book._id) {
      wx.showToast({
        title: '书籍信息异常',
        icon: 'none'
      });
      return;
    }

    if (!openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '添加中...' });

    // 使用云函数添加购物车
    wx.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'add',
        data: {
          bookId: book._id
        }
      }
    }).then(res => {
      wx.hideLoading();
      console.log('添加购物车结果:', res);
      
      if (res.result && res.result.success) {
        wx.showToast({
          title: res.result.message || '已加入购物车',
          icon: 'success'
        });
        this.loadCartCount();
      } else {
        wx.showToast({
          title: res.result?.message || '添加失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('添加购物车失败:', err);
      wx.showToast({
        title: '添加失败: ' + (err.errMsg || '请重试'),
        icon: 'none'
      });
    });
  },
  // 分享书籍
  shareBook() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },
  // 返回上一页
  goBack() {
    wx.navigateBack();
  },
  // 跳转到购物车
  goToCart() {
    if (!this.data.isDragging) {
      wx.navigateTo({
        url: '/pages/cart/cart'
      });
    }
  },
  // 触摸开始事件
  touchStart(e) {
    // 强制获取屏幕尺寸信息,确保在触摸结束时能正确吸附
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

    // 立即更新拖动状态
    this.setData({ isDragging: true });

    // 使用缓存的屏幕尺寸信息
    const screenWidth = this.screenInfo ? this.screenInfo.width : 375;
    const screenHeight = this.screenInfo ? this.screenInfo.height : 667;
    const buttonWidth = 96; // 按钮宽度
    const buttonHeight = 96; // 按钮高度

    // 直接计算按钮位置,使用手指位置作为按钮中心
    let newX = moveX - buttonWidth / 2;
    let newY = moveY - buttonHeight / 2;

    // 边界检查,允许按钮完全贴紧屏幕边缘
    newX = Math.max(0, Math.min(newX, screenWidth - buttonWidth));
    newY = Math.max(0, Math.min(newY, screenHeight - buttonHeight));

    // 更新位置
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
  touchEnd() {
    // 自动吸附到边缘的逻辑
    if (this.screenInfo) {
      const screenWidth = this.screenInfo.width;
      const buttonWidth = 96; // 按钮宽度
      const lastX = this.data.startX;
      const lastY = this.data.startY;

      // 计算吸附位置
      let snapX;
      if (lastX < screenWidth / 2) {
        // 左侧区域,吸附到左侧边缘
        snapX = 0;
      } else {
        // 右侧区域,吸附到右侧边缘
        snapX = screenWidth - buttonWidth;
      }

      // 保持Y轴位置不变
      let snapY = lastY - buttonWidth / 2;

      // 边界检查Y轴
      snapY = Math.max(0, Math.min(snapY, this.screenInfo.height - buttonWidth));

      // 更新位置
      this.setData({
        cartButtonLeft: snapX + 'px',
        cartButtonTop: snapY + 'px',
        cartButtonRight: null,
        cartButtonBottom: null
      });
    }

    this.setData({ isDragging: false });
  },
  // 分享配置
  onShareAppMessage() {
    const book = this.data.book;
    return {
      title: book.title || '二手教材',
      path: '/pages/bookDetail/bookDetail?id=' + book._id,
      imageUrl: this.data.imageUrls[0] || ''
    };
  }
});
