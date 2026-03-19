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

    console.log('购物车操作:', { OPENID, action, data })

    // 初始化数据库
    const db = cloud.database()
    const _ = db.command

    switch (action) {
      // 添加到购物车
      case 'add': {
        const { bookId } = data

        // 检查书籍是否存在
        const bookRes = await db.collection('books').doc(bookId).get()
        if (!bookRes.data) {
          return {
            success: false,
            message: '书籍不存在'
          }
        }

        const book = bookRes.data

        // 处理图片字段 - 可能是 image 或 images
        let bookImage = ''
        if (book.images && book.images.length > 0) {
          bookImage = book.images[0]
        } else if (book.image) {
          bookImage = book.image
        } else {
          // 使用默认图片
          bookImage = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'
        }

        // 检查是否已在购物车
        const cartRes = await db.collection('cart').where({
          _openid: OPENID,
          bookId: bookId
        }).get()

        if (cartRes.data.length > 0) {
          // 已存在，更新数量
          await db.collection('cart').doc(cartRes.data[0]._id).update({
            data: {
              quantity: _.inc(1),
              updateTime: db.serverDate()
            }
          })
        } else {
          // 不存在，添加到购物车
          await db.collection('cart').add({
            data: {
              _openid: OPENID,
              bookId: bookId,
              bookTitle: book.title,
              bookAuthor: book.author,
              bookPrice: book.price,
              bookImage: bookImage,
              sellerId: book.sellerId || book._openid,
              quantity: 1,
              createTime: db.serverDate(),
              updateTime: db.serverDate()
            }
          })
        }

        return {
          success: true,
          message: '已添加到购物车'
        }
      }

      // 从购物车移除
      case 'remove': {
        const { cartItemId } = data

        console.log('删除购物车商品, cartItemId:', cartItemId)

        try {
          await db.collection('cart').doc(cartItemId).remove()
          console.log('删除成功')
        } catch (err) {
          console.error('删除失败:', err)
          return {
            success: false,
            message: '删除失败: ' + err.message
          }
        }

        return {
          success: true,
          message: '已从购物车移除'
        }
      }

      // 更新数量
      case 'updateQuantity': {
        const { cartItemId, quantity } = data

        if (quantity <= 0) {
          return {
            success: false,
            message: '数量必须大于0'
          }
        }

        await db.collection('cart').doc(cartItemId).update({
          data: {
            quantity: quantity,
            updateTime: db.serverDate()
          }
        })

        return {
          success: true,
          message: '数量已更新'
        }
      }

      // 获取购物车列表
      case 'getList': {
        const res = await db.collection('cart')
          .where({ _openid: OPENID })
          .orderBy('createTime', 'desc')
          .get()

        // 补充图片信息（从书籍表中获取最新的图片）
        const cartItems = await Promise.all(res.data.map(async (item) => {
          try {
            const bookRes = await db.collection('books').doc(item.bookId).get()
            if (bookRes.data) {
              const book = bookRes.data
              let bookImage = item.bookImage || '' // 保留原有图片作为备用
              
              // 从书籍表获取最新图片
              if (book.images && book.images.length > 0) {
                bookImage = book.images[0]
              } else if (book.image) {
                bookImage = book.image
              } else if (!bookImage) {
                // 如果书籍表也没有图片，使用默认图片
                bookImage = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'
              }
              
              return {
                ...item,
                bookImage: bookImage
              }
            }
          } catch (err) {
            console.error('获取书籍图片失败:', err, 'bookId:', item.bookId)
          }
          return item
        }))

        return {
          success: true,
          data: cartItems
        }
      }

      // 获取购物车数量
      case 'getCount': {
        const res = await db.collection('cart')
          .where({ _openid: OPENID })
          .count()

        return {
          success: true,
          count: res.total
        }
      }

      // 清空购物车
      case 'clear': {
        await db.collection('cart')
          .where({ _openid: OPENID })
          .remove()

        return {
          success: true,
          message: '购物车已清空'
        }
      }

      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (error) {
    console.error('购物车操作失败:', error)
    return {
      success: false,
      message: error.message || '操作失败',
      error: error
    }
  }
}
