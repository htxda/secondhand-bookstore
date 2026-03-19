// profile.js
Page({
  data: {
    cartButtonTop: null,
    cartButtonBottom: '120rpx',
    cartButtonLeft: null,
    cartButtonRight: '32rpx',
    startX: 0,
    startY: 0,
    isDragging: false,
    user: {
      name: "用户",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      booksSold: 12,
      booksBought: 8
    },
    menuItems: [
      {
        id: "sold",
        title: "我卖出的",
        icon: "📤",
        count: 12
      },
      {
        id: "bought",
        title: "我买到的",
        icon: "📥",
        count: 8
      },
      {
        id: "published",
        title: "我的发布",
        icon: "📚",
        count: 5
      },
      {
        id: "favorites",
        title: "我的收藏",
        icon: "❤️",
        count: 15
      }
    ],
    settingsItems: [
      {
        id: "profile",
        title: "个人资料",
        icon: "👤"
      },
      {
        id: "address",
        title: "收货地址",
        icon: "📍"
      },
      {
        id: "help",
        title: "帮助中心",
        icon: "❓"
      },
      {
        id: "settings",
        title: "设置",
        icon: "⚙️"
      }
    ]
  },
  onLoad() {
    // 页面加载时的逻辑
    console.log('Profile page loaded');

    // 检查登录状态
    this.checkUserLogin();

    // 加载统计数据
    this.loadUserStats();
  },
  onShow() {
    // 页面显示时的逻辑
    this.checkUserLogin();

    // 重新加载统计数据
    this.loadUserStats();
    
    // 设置自定义TabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4  // 个人资料在tabBar列表中是第5个，索引为4
      });
    }
  },

  // 加载用户统计数据
  loadUserStats() {
    const openid = wx.getStorageSync('openid');
    if (!openid) return;

    // 获取我的发布数量
    wx.cloud.callFunction({
      name: 'book',
      data: {
        action: 'getMyBooks',
        data: { status: 'available' }
      }
    }).then(res => {
      const publishedCount = res.result && res.result.success ? (res.result.data || []).length : 0;

      // 获取收藏数量
      wx.cloud.callFunction({
        name: 'favorite',
        data: {
          action: 'getCount'
        }
      }).then(favRes => {
        const favoriteCount = favRes.result && favRes.result.success ? (favRes.result.count || 0) : 0;

        // 获取购物车数量
        wx.cloud.callFunction({
          name: 'cart',
          data: {
            action: 'getCount'
          }
        }).then(cartRes => {
          const cartCount = cartRes.result && cartRes.result.success ? (cartRes.result.count || 0) : 0;

          this.setData({
            'menuItems[2].count': publishedCount,
            'menuItems[3].count': favoriteCount,
            cartCount: cartCount
          });
        });
      });
    }).catch(err => {
      console.error('加载统计数据失败:', err);
    });
  },

  // 检查用户登录状态
  checkUserLogin() {
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');

    if (openid && userInfo) {
      // 用户已登录，更新 UI
      this.setData({
        user: {
          name: userInfo.name || '微信用户',
          avatar: userInfo.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=80&w=1080',
          rating: userInfo.rating || 5.0,
          booksSold: userInfo.booksSold || 0,
          booksBought: userInfo.booksBought || 0
        },
        isLoggedIn: true
      });
    } else {
      this.setData({
        isLoggedIn: false
      });
    }
  },

  // 更新用户信息（点击头像或昵称）
  updateUserInfo() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    // 显示选择操作
    wx.showActionSheet({
      itemList: ['修改头像', '修改昵称', '同时修改头像和昵称'],
      success: (res) => {
        const tapIndex = res.tapIndex;

        if (tapIndex === 0) {
          // 只修改头像
          this.updateAvatar();
        } else if (tapIndex === 1) {
          // 只修改昵称
          this.updateNickname();
        } else if (tapIndex === 2) {
          // 同时修改
          this.updateNicknameAndAvatar();
        }
      }
    });
  },

  // 只修改头像
  updateAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (mediaRes) => {
        const tempFilePath = mediaRes.tempFiles[0].tempFilePath;

        wx.showLoading({ title: '上传中...' });

        // 上传图片到云存储
        wx.cloud.uploadFile({
          cloudPath: `avatars/${Date.now()}.jpg`,
          filePath: tempFilePath,
          success: (uploadRes) => {
            const fileID = uploadRes.fileID;

            // 调用云函数更新用户信息
            wx.cloud.callFunction({
              name: 'updateUserInfo',
              data: {
                userInfo: {
                  name: this.data.user.name,
                  avatarUrl: fileID
                }
              }
            }).then(updateRes => {
              wx.hideLoading();

              if (updateRes.result.success) {
                // 更新本地存储
                const userInfo = wx.getStorageSync('userInfo') || {};
                userInfo.avatar = fileID;
                wx.setStorageSync('userInfo', userInfo);

                // 更新页面 UI
                this.setData({
                  'user.avatar': fileID
                });

                wx.showToast({
                  title: '头像更新成功',
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: '更新失败',
                  icon: 'none'
                });
              }
            }).catch(err => {
              wx.hideLoading();
              console.error('更新用户信息失败:', err);
              wx.showToast({
                title: '更新失败',
                icon: 'none'
              });
            });
          },
          fail: (uploadErr) => {
            wx.hideLoading();
            console.error('上传图片失败:', uploadErr);
            wx.showToast({
              title: '上传图片失败',
              icon: 'none'
            });
          }
        });
      }
    });
  },

  // 只修改昵称
  updateNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入您的昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          const newName = res.content.trim();

          if (!newName) {
            wx.showToast({
              title: '昵称不能为空',
              icon: 'none'
            });
            return;
          }

          wx.showLoading({ title: '更新中...' });

          // 调用云函数更新用户信息
          wx.cloud.callFunction({
            name: 'updateUserInfo',
            data: {
              userInfo: {
                name: newName,
                avatarUrl: this.data.user.avatar
              }
            }
          }).then(updateRes => {
            wx.hideLoading();

            if (updateRes.result.success) {
              // 更新本地存储
              const userInfo = wx.getStorageSync('userInfo') || {};
              userInfo.name = newName;
              wx.setStorageSync('userInfo', userInfo);

              // 更新页面 UI
              this.setData({
                'user.name': newName
              });

              wx.showToast({
                title: '昵称更新成功',
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: '更新失败',
                icon: 'none'
              });
            }
          }).catch(err => {
            wx.hideLoading();
            console.error('更新用户信息失败:', err);
            wx.showToast({
              title: '更新失败',
              icon: 'none'
            });
          });
        }
      }
    });
  },

  // 同时修改头像和昵称
  updateNicknameAndAvatar() {
    // 先输入昵称
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入您的昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          const newName = res.content.trim();

          if (!newName) {
            wx.showToast({
              title: '昵称不能为空',
              icon: 'none'
            });
            return;
          }

          // 选择头像
          wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (mediaRes) => {
              const tempFilePath = mediaRes.tempFiles[0].tempFilePath;

              wx.showLoading({ title: '上传中...' });

              // 上传图片到云存储
              wx.cloud.uploadFile({
                cloudPath: `avatars/${Date.now()}.jpg`,
                filePath: tempFilePath,
                success: (uploadRes) => {
                  const fileID = uploadRes.fileID;

                  // 调用云函数更新用户信息
                  wx.cloud.callFunction({
                    name: 'updateUserInfo',
                    data: {
                      userInfo: {
                        name: newName,
                        avatarUrl: fileID
                      }
                    }
                  }).then(updateRes => {
                    wx.hideLoading();

                    if (updateRes.result.success) {
                      // 更新本地存储
                      const userInfo = wx.getStorageSync('userInfo') || {};
                      userInfo.name = newName;
                      userInfo.avatar = fileID;
                      wx.setStorageSync('userInfo', userInfo);

                      // 更新页面 UI
                      this.setData({
                        'user.name': newName,
                        'user.avatar': fileID
                      });

                      wx.showToast({
                        title: '更新成功',
                        icon: 'success'
                      });
                    } else {
                      wx.showToast({
                        title: '更新失败',
                        icon: 'none'
                      });
                    }
                  }).catch(err => {
                    wx.hideLoading();
                    console.error('更新用户信息失败:', err);
                    wx.showToast({
                      title: '更新失败',
                      icon: 'none'
                    });
                  });
                },
                fail: (uploadErr) => {
                  wx.hideLoading();
                  console.error('上传图片失败:', uploadErr);
                  wx.showToast({
                    title: '上传图片失败',
                    icon: 'none'
                  });
                }
              });
            }
          });
        }
      }
    });
  },
  // 菜单点击事件
  menuItemTap(e) {
    const id = e.currentTarget.dataset.id;
    const openid = wx.getStorageSync('openid');

    if (!openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    switch(id) {
      case 'sold':
        // 我卖出的
        wx.showToast({
          title: '订单功能开发中',
          icon: 'none'
        });
        break;
      case 'bought':
        // 我买到的
        wx.showToast({
          title: '订单功能开发中',
          icon: 'none'
        });
        break;
      case 'published':
        // 我的发布
        wx.showToast({
          title: '我的发布功能开发中',
          icon: 'none'
        });
        break;
      case 'favorites':
        // 我的收藏
        wx.showToast({
          title: '收藏功能开发中',
          icon: 'none'
        });
        break;
    }
  },
  // 设置项点击事件
  settingItemTap(e) {
    const id = e.currentTarget.dataset.id;

    switch(id) {
      case 'profile':
        // 个人资料
        wx.showToast({
          title: '个人资料功能开发中',
          icon: 'none'
        });
        break;
      case 'address':
        // 收货地址
        wx.showToast({
          title: '收货地址功能开发中',
          icon: 'none'
        });
        break;
      case 'help':
        // 帮助中心
        wx.showToast({
          title: '帮助中心功能开发中',
          icon: 'none'
        });
        break;
      case 'settings':
        // 设置
        wx.showToast({
          title: '设置功能开发中',
          icon: 'none'
        });
        break;
    }
  },
  // 登录/注册按钮点击事件
  login() {
    // 第一步：确认是否使用微信登录
    wx.showModal({
      title: '微信快捷登录',
      content: '是否使用当前微信账号登录二手商城？登录后可以发布书籍、购买书籍等。',
      confirmText: '确认登录',
      cancelText: '取消',
      confirmColor: '#FF8FA3',
      success: (res) => {
        if (res.confirm) {
          // 用户确认，进入第二步
          this.getUserInfoAuth();
        }
      }
    });
  },

  // 第二步：获取用户信息授权
  getUserInfoAuth() {
    // 先获取微信的 openid
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      console.log('云函数调用成功:', res);

      if (res.result && res.result.success) {
        const { openid, userInfo, isNewUser } = res.result;

        // 保存 openid 到本地存储
        wx.setStorageSync('openid', openid);
        wx.setStorageSync('userInfo', userInfo);

        // 更新全局数据
        const app = getApp();
        if (!app.globalData) {
          app.globalData = {};
        }
        app.globalData.openid = openid;
        app.globalData.userInfo = {
          ...userInfo,
          isLoggedIn: true
        };

        // 第三步：根据用户类型显示不同的提示
        if (isNewUser) {
          // 新用户：提示补充头像和昵称
          wx.showModal({
            title: '欢迎来到二手商城',
            content: '登录成功！是否立即设置您的头像和昵称？',
            confirmText: '去设置',
            cancelText: '稍后',
            confirmColor: '#FF8FA3',
            success: (modalRes) => {
              // 更新页面 UI
              this.updateUserInfoUI(userInfo);

              if (modalRes.confirm) {
                // 用户选择去设置，打开编辑窗口
                this.updateUserInfo();
              }
            }
          });
        } else {
          // 老用户：直接显示登录成功
          this.updateUserInfoUI(userInfo);

          wx.showToast({
            title: '登录成功，欢迎回来',
            icon: 'success',
            duration: 2000
          });
        }
      } else {
        wx.showToast({
          title: res.result?.message || '登录失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('登录失败:', err);
      wx.showToast({
        title: '登录失败，请检查网络连接',
        icon: 'none',
        duration: 2500
      });
    });
  },

  // 更新用户信息 UI
  updateUserInfoUI(userInfo) {
    this.setData({
      user: {
        name: userInfo.name,
        avatar: userInfo.avatar,
        rating: userInfo.rating,
        booksSold: userInfo.booksSold,
        booksBought: userInfo.booksBought
      },
      isLoggedIn: true
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync('openid');
          wx.removeStorageSync('userInfo');

          // 清除全局数据
          const app = getApp();
          app.globalData.userInfo = null;

          // 重置页面状态
          this.setData({
            user: {
              name: '用户',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=80&w=1080',
              rating: 4.8,
              booksSold: 12,
              booksBought: 8
            },
            isLoggedIn: false
          });

          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
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
    // 强制获取屏幕尺寸信息，确保在触摸结束时能正确吸附
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
    
    // 直接计算按钮位置，使用手指位置作为按钮中心
    let newX = moveX - buttonWidth / 2;
    let newY = moveY - buttonHeight / 2;
    
    // 边界检查，允许按钮完全贴紧屏幕边缘
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
  touchEnd(e) {
    // 自动吸附到边缘的逻辑
    if (this.screenInfo) {
      const screenWidth = this.screenInfo.width;
      const buttonWidth = 96; // 按钮宽度
      const lastX = this.data.startX;
      const lastY = this.data.startY;
      
      // 计算吸附位置
      let snapX;
      if (lastX < screenWidth / 2) {
        // 左侧区域，吸附到左側边缘
        snapX = 0;
      } else {
        // 右侧区域，吸附到右側边缘
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
  }
});