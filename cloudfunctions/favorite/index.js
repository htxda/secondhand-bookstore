// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云函数
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取微信上下文
    const { OPENID } = cloud.getWXContext()

    // 获取操作类型
    const { action, data } = event

    console.log('收藏操作:', { OPENID, action, data })

    // 初始化数据库
    const db = cloud.database()

    switch (action) {
      // 添加收藏
      case 'add': {
        const { bookId, bookTitle, bookAuthor, bookPrice, bookImage, sellerId } = data

        // 检查书籍是否存在
        const bookRes = await db.collection('books').doc(bookId).get()
        if (!bookRes.data) {
          return {
            success: false,
            message: '书籍不存在'
          }
        }

        // 检查是否已收藏
        const favRes = await db.collection('favorites').where({
          _openid: OPENID,
          bookId: bookId
        }).get()

        if (favRes.data.length > 0) {
          return {
            success: false,
            message: '已收藏该书籍'
          }
        }

        // 添加到收藏
        await db.collection('favorites').add({
          data: {
            _openid: OPENID,
            bookId: bookId,
            bookTitle: bookTitle || bookRes.data.title,
            bookAuthor: bookAuthor || bookRes.data.author,
            bookPrice: bookPrice || bookRes.data.price,
            bookImage: bookImage || bookRes.data.image,
            sellerId: sellerId || bookRes.data.sellerId,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        })

        return {
          success: true,
          message: '已添加到收藏'
        }
      }

      // 取消收藏
      case 'remove': {
        const { favoriteId } = data

        await db.collection('favorites').doc(favoriteId).remove()

        return {
          success: true,
          message: '已取消收藏'
        }
      }

      // 检查是否已收藏
      case 'check': {
        const { bookId } = data

        const res = await db.collection('favorites').where({
          _openid: OPENID,
          bookId: bookId
        }).get()

        return {
          success: true,
          isFavorited: res.data.length > 0
        }
      }

      // 获取收藏列表
      case 'getList': {
        const res = await db.collection('favorites')
          .where({ _openid: OPENID })
          .orderBy('createTime', 'desc')
          .get()

        return {
          success: true,
          data: res.data
        }
      }

      // 获取收藏数量
      case 'getCount': {
        const res = await db.collection('favorites')
          .where({ _openid: OPENID })
          .count()

        return {
          success: true,
          count: res.total
        }
      }

      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    return {
      success: false,
      message: error.message || '操作失败',
      error: error
    }
  }
}
