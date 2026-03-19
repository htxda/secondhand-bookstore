// cart.js
Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    selectedAll: true,
    selectedIds: [],
    cartCount: 0
  },
  onLoad() {
    console.log('Cart page loaded');
  },
  onShow() {
    // 检查用户是否已登录
    const app = getApp();
    const openid = app.globalData.openid || wx.getStorageSync('openid');

    if (!openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再查看购物车',
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

    // 每次显示页面时,重新加载购物车数据
    this.loadCartList();
    
    // 设置自定义TabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3  // 购物车在tabBar列表中是第4个，索引为3
      });
    }
    
    // 加载购物车数量（用于悬浮按钮显示）
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

  // 加载购物车列表
  loadCartList() {
    wx.showLoading({ title: '加载中...' });

    // 优先从 globalData 获取，否则从本地存储获取
    const app = getApp();
    let openid = app.globalData.openid || wx.getStorageSync('openid');

    console.log('loadCartList openid:', openid);

    if (!openid) {
      wx.hideLoading();
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'getList'
      }
    }).then(res => {
      wx.hideLoading();
      console.log('购物车数据:', res);

      if (res.result && res.result.success) {
        const cartItems = res.result.data || [];
        console.log('购物车商品数:', cartItems.length);

        // 默认全选
        const selectedIds = cartItems.map(item => item._id);

        this.setData({
          cartItems,
          selectedIds,
          selectedAll: true,
          cartCount: cartItems.length
        });
        this.calculateTotal();

        // 如果购物车为空,显示提示
        if (cartItems.length === 0) {
          wx.showToast({
            title: '购物车为空',
            icon: 'none',
            duration: 1500
          });
        }
      } else {
        wx.showToast({
          title: res.result.message || '加载失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('加载购物车失败:', err);
      wx.showToast({
        title: '加载失败: ' + (err.errMsg || '请重试'),
        icon: 'none'
      });
    });
  },

  // 计算总价
  calculateTotal() {
    const selectedItems = this.data.cartItems.filter(item =>
      this.data.selectedIds.includes(item._id)
    );
    const total = selectedItems.reduce((sum, item) => {
      return sum + (item.bookPrice || 0) * (item.quantity || 1);
    }, 0);
    this.setData({ totalPrice: total });
  },

  // 切换单个商品选中状态
  toggleSelect(e) {
    console.log('toggleSelect called:', e);
    const id = e.currentTarget.dataset.id;
    console.log('selected item id:', id);

    let selectedIds = this.data.selectedIds || [];
    selectedIds = [...selectedIds];

    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter(itemId => itemId !== id);
      console.log('取消选中');
    } else {
      selectedIds.push(id);
      console.log('选中商品');
    }

    this.setData({
      selectedIds,
      selectedAll: selectedIds.length === this.data.cartItems.length
    });

    console.log('selectedIds:', selectedIds);
    this.calculateTotal();
  },

  // 全选/取消全选
  toggleSelectAll() {
    console.log('toggleSelectAll called, current selectedAll:', this.data.selectedAll);

    if (this.data.selectedAll) {
      // 取消全选
      this.setData({
        selectedIds: [],
        selectedAll: false
      });
      console.log('取消全选');
    } else {
      // 全选
      const selectedIds = this.data.cartItems.map(item => item._id);
      this.setData({
        selectedIds,
        selectedAll: true
      });
      console.log('全选, selectedIds:', selectedIds);
    }
    this.calculateTotal();
  },

  // 增减数量
  changeQuantity(e) {
    const { id, type } = e.currentTarget.dataset;
    const cartItems = [...this.data.cartItems];
    const index = cartItems.findIndex(item => item._id === id);

    if (index === -1) return;

    let newQuantity = cartItems[index].quantity;

    if (type === 'increase') {
      newQuantity++;
    } else if (type === 'decrease' && newQuantity > 1) {
      newQuantity--;
    } else if (type === 'decrease' && newQuantity === 1) {
      // 数量为1时,点击减少按钮,询问是否删除
      wx.showModal({
        title: '提示',
        content: '确定删除该商品吗?',
        success: (res) => {
          if (res.confirm) {
            this.deleteItem(id);
          }
        }
      });
      return;
    }

    // 更新到数据库
    wx.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'updateQuantity',
        data: {
          cartItemId: id,
          quantity: newQuantity
        }
      }
    }).then(res => {
      if (res.result && res.result.success) {
        cartItems[index].quantity = newQuantity;
        this.setData({ cartItems });
        this.calculateTotal();
      } else {
        wx.showToast({
          title: res.result.message || '更新失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('更新数量失败:', err);
      wx.showToast({
        title: '更新失败',
        icon: 'none'
      });
    });
  },

  // 删除商品
  deleteItem(e) {
    // 处理事件对象，从中获取 id
    const id = e.currentTarget ? e.currentTarget.dataset.id : e;
    console.log('deleteItem called, id:', id);

    wx.cloud.callFunction({
      name: 'cart',
      data: {
        action: 'remove',
        data: {
          cartItemId: id
        }
      }
    }).then(res => {
      if (res.result && res.result.success) {
        console.log('删除成功');
        // 从本地列表中删除
        const cartItems = this.data.cartItems.filter(item => item._id !== id);
        const selectedIds = (this.data.selectedIds || []).filter(itemId => itemId !== id);

        this.setData({
          cartItems,
          selectedIds,
          selectedAll: selectedIds.length === cartItems.length && cartItems.length > 0
        });
        this.calculateTotal();

        wx.showToast({
          title: '已删除',
          icon: 'success'
        });

        // 如果购物车为空
        if (cartItems.length === 0) {
          wx.showToast({
            title: '购物车为空',
            icon: 'none'
          });
        }
      } else {
        wx.showToast({
          title: res.result.message || '删除失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('删除失败:', err);
      wx.showToast({
        title: '删除失败: ' + (err.errMsg || '请重试'),
        icon: 'none'
      });
    });
  },

  // 批量删除选中的商品
  batchDelete() {
    const selectedIds = this.data.selectedIds || [];
    const count = selectedIds.length;

    if (count === 0) {
      wx.showToast({
        title: '请先选择要删除的商品',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '提示',
      content: `确定删除选中的 ${count} 件商品吗?`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });

          // 并行删除所有选中的商品
          const deletePromises = selectedIds.map(id => {
            return wx.cloud.callFunction({
              name: 'cart',
              data: {
                action: 'remove',
                data: {
                  cartItemId: id
                }
              }
            });
          });

          Promise.all(deletePromises).then(results => {
            wx.hideLoading();

            // 统计成功和失败的数量
            const successCount = results.filter(res => res.result && res.result.success).length;

            if (successCount === count) {
              wx.showToast({
                title: `已删除 ${successCount} 件商品`,
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: `成功删除 ${successCount}/${count} 件商品`,
                icon: 'none'
              });
            }

            // 重新加载购物车
            this.loadCartList();
          }).catch(err => {
            wx.hideLoading();
            console.error('批量删除失败:', err);
            wx.showToast({
              title: '删除失败,请重试',
              icon: 'none'
            });
          });
        }
      }
    });
  },

  // 结算
  checkout() {
    const selectedItems = this.data.cartItems.filter(item =>
      (this.data.selectedIds || []).includes(item._id)
    );

    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择要结算的商品',
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: '结算功能开发中',
      icon: 'none'
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 去逛逛
  goToBooks() {
    wx.switchTab({
      url: '/pages/books/books'
    });
  },

  // 跳转到书籍详情
  goToBookDetail(e) {
    const bookId = e.currentTarget.dataset.bookId;
    wx.navigateTo({
      url: '/pages/bookDetail/bookDetail?id=' + bookId
    });
  }
});