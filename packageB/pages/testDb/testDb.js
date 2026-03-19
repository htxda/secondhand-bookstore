// testDb.js
// 测试数据库连接和查询

Page({
  data: {
    testResult: ''
  },

  onLoad() {
    this.testDatabase();
  },

  // 测试数据库
  testDatabase() {
    console.log('开始测试数据库连接...');

    const db = wx.cloud.database();

    // 测试1: 查询所有书籍
    db.collection('books')
      .where({
        status: 'available'
      })
      .limit(1)
      .get()
      .then(res => {
        console.log('查询成功:', res);
        const books = res.data || [];

        if (books.length > 0) {
          const book = books[0];
          const bookId = book._id;

          this.setData({
            testResult: `找到 ${books.length} 本书\n第一本书ID: ${bookId}\n书名: ${book.title}`
          });

          // 测试2: 通过ID查询书籍
          db.collection('books')
            .doc(bookId)
            .get()
            .then(docRes => {
              console.log('ID查询成功:', docRes);
              this.setData({
                testResult: this.data.testResult + `\n\nID查询成功:\n${docRes.data.title}`
              });
            })
            .catch(err => {
              console.error('ID查询失败:', err);
              this.setData({
                testResult: this.data.testResult + `\n\nID查询失败: ${err.errMsg}`
              });
            });
        } else {
          this.setData({
            testResult: '数据库中没有书籍数据'
          });
        }
      })
      .catch(err => {
        console.error('查询失败:', err);
        this.setData({
          testResult: `查询失败:\n错误码: ${err.errCode}\n错误信息: ${err.errMsg}`
        });
      });
  }
});
