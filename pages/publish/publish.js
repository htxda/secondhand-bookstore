// publish.js
Page({
  data: {
    cartButtonTop: null,
    cartButtonBottom: '120rpx',
    cartButtonLeft: null,
    cartButtonRight: '32rpx',
    startX: 0,
    startY: 0,
    isDragging: false,
    formData: {
      title: "",
      author: "",
      subject: "", // 与云函数中的 subject 字段对应
      subjectIndex: 0,
      condition: "良好",
      conditionIndex: 2,
      price: "",
      originalPrice: "",
      description: ""
    },
    conditions: ["全新", "几乎全新", "良好", "一般"],
    subjects: ["数学", "英语", "计算机", "物理", "化学", "经济", "文学", "其他"], // 这些值将作为 subject 的选项
    images: [],
    isSubmitting: false,
    cartCount: 0
  },
  onLoad() {
    // 页面加载时的逻辑
    console.log('Publish page loaded');
  },
  onShow() {
    // 页面显示时的逻辑
    // 设置自定义TabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2  // 发布在tabBar列表中是第3个，索引为2
      });
    }
    
    // 加载购物车数量
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
  // 表单输入事件
  handleInput(e) {
    const { name } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({
      [`formData.${name}`]: value
    });
  },
  // 选择条件
  selectCondition(e) {
    const index = e.detail.value;
    const condition = this.data.conditions[index];
    this.setData({
      "formData.condition": condition,
      "formData.conditionIndex": index
    });
  },
  // 选择科目/分类
  selectSubject(e) {
    const index = e.detail.value;
    const subject = this.data.subjects[index];
    this.setData({
      "formData.subject": subject,
      "formData.subjectIndex": index
    });
  },
  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 3,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: res.tempFiles
        });
      }
    });
  },
  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({
      images: images
    });
  },
  // 提交表单
  submitForm() {
    // 表单验证
    const { title, author, subject, condition, price, originalPrice, description } = this.data.formData;
    const images = this.data.images;

    // 验证必填字段
    if (!title || !title.trim()) {
      wx.showToast({
        title: '请输入书名',
        icon: 'none'
      });
      return;
    }

    if (!author || !author.trim()) {
      wx.showToast({
        title: '请输入作者',
        icon: 'none'
      });
      return;
    }

    if (!subject) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none'
      });
      return;
    }

    if (!condition) {
      wx.showToast({
        title: '请选择新旧程度',
        icon: 'none'
      });
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      wx.showToast({
        title: '请输入正确的价格',
        icon: 'none'
      });
      return;
    }

    if (!images || images.length === 0) {
      wx.showToast({
        title: '请上传书籍图片',
        icon: 'none'
      });
      return;
    }

    // 提交表单
    this.setData({ isSubmitting: true });

    // 上传第一张图片到云存储
    wx.cloud.uploadFile({
      cloudPath: `books/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`,
      filePath: images[0].tempFilePath,
      success: (uploadRes) => {
        const fileID = uploadRes.fileID;

        // 获取临时访问链接，确保其他用户可以访问
        wx.cloud.getTempFileURL({
          fileList: [fileID],
          success: (res) => {
            const imageUrl = res.fileList[0].tempFileURL;

            // 调用云函数发布书籍
            wx.cloud.callFunction({
              name: 'book',
              data: {
                action: 'publish',
                data: {
                  title: title.trim(),
                  author: author.trim(),
                  category: subject, // 云函数使用category字段
                  subject: subject, // 云函数也使用subject字段
                  condition: condition,
                  price: parseFloat(price),
                  originalPrice: parseFloat(originalPrice) || parseFloat(price),
                  description: description ? description.trim() : '暂无描述',
                  image: imageUrl
                }
              }
            }).then(res => {
              this.setData({ isSubmitting: false });

              if (res.result && res.result.success) {
                wx.showToast({
                  title: '发布成功',
                  icon: 'success'
                });
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/index/index'
                  });
                }, 1500);
              } else {
                wx.showToast({
                  title: res.result.message || '发布失败',
                  icon: 'none'
                });
              }
            }).catch(err => {
              this.setData({ isSubmitting: false });
              console.error('发布失败:', err);
              wx.showToast({
                title: '发布失败，请稍后重试',
                icon: 'none'
              });
            });
          },
          fail: (err) => {
            this.setData({ isSubmitting: false });
            console.error('获取临时链接失败:', err);
            wx.showToast({
              title: '获取图片链接失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (uploadErr) => {
        this.setData({ isSubmitting: false });
        console.error('上传图片失败:', uploadErr);
        wx.showToast({
          title: '上传图片失败',
          icon: 'none'
        });
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
  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
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
        // 左侧区域，吸附到左侧边缘
        snapX = 0;
      } else {
        // 右侧区域，吸附到右侧边缘
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