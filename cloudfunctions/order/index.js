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

    console.log('订单操作:', { OPENID, action, data })

    // 初始化数据库
    const db = cloud.database()
    const _ = db.command

    switch (action) {
      // 创建订单
      case 'create': {
        const { cartItems, address } = data

        if (!cartItems || cartItems.length === 0) {
          return {
            success: false,
            message: '购物车为空'
          }
        }

        // 计算总价
        let totalPrice = 0
        const orderItems = []

        for (const item of cartItems) {
          // 检查书籍状态
          const bookRes = await db.collection('books').doc(item.bookId).get()
          if (!bookRes.data) {
            return {
              success: false,
              message: `书籍 ${item.bookTitle} 不存在`
            }
          }

          // 检查是否已被购买
          if (bookRes.data.status === 'sold') {
            return {
              success: false,
              message: `书籍 ${item.bookTitle} 已售出`
            }
          }

          orderItems.push({
            bookId: item.bookId,
            bookTitle: item.bookTitle,
            bookAuthor: item.bookAuthor,
            bookPrice: item.bookPrice,
            bookImage: item.bookImage,
            sellerId: item.sellerId,
            quantity: item.quantity,
            subtotal: item.bookPrice * item.quantity
          })

          totalPrice += item.bookPrice * item.quantity
        }

        // 创建订单
        const orderRes = await db.collection('orders').add({
          data: {
            _openid: OPENID,
            orderNo: `ORD${Date.now()}${Math.floor(Math.random() * 10000)}`,
            items: orderItems,
            totalPrice: totalPrice,
            buyerInfo: address,
            status: 'pending', // pending, paid, shipped, completed, cancelled
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        })

        // 更新书籍状态为已售出
        for (const item of cartItems) {
          await db.collection('books').doc(item.bookId).update({
            data: {
              status: 'sold',
              buyerId: OPENID,
              updateTime: db.serverDate()
            }
          })
        }

        // 更新买家的购买数量
        await db.collection('users').where({
          _openid: OPENID
        }).update({
          data: {
            booksBought: _.inc(cartItems.length),
            updateTime: db.serverDate()
          }
        })

        // 更新卖家的卖出数量
        for (const item of orderItems) {
          await db.collection('users').where({
            _openid: item.sellerId
          }).update({
            data: {
              booksSold: _.inc(1),
              updateTime: db.serverDate()
            }
          })
        }

        // 清空购物车
        const cartItemIds = cartItems.map(item => item._id)
        for (const cartItemId of cartItemIds) {
          await db.collection('cart').doc(cartItemId).remove()
        }

        return {
          success: true,
          message: '订单创建成功',
          data: {
            orderId: orderRes._id,
            orderNo: `ORD${Date.now()}${Math.floor(Math.random() * 10000)}`
          }
        }
      }

      // 获取订单列表
      case 'getList': {
        const { status } = data

        let query = db.collection('orders').where({ _openid: OPENID })

        if (status) {
          query = query.where({ status: status })
        }

        const res = await query.orderBy('createTime', 'desc').get()

        return {
          success: true,
          data: res.data
        }
      }

      // 获取订单详情
      case 'getDetail': {
        const { orderId } = data

        const res = await db.collection('orders').doc(orderId).get()

        return {
          success: true,
          data: res.data
        }
      }

      // 取消订单
      case 'cancel': {
        const { orderId } = data

        const orderRes = await db.collection('orders').doc(orderId).get()
        if (!orderRes.data) {
          return {
            success: false,
            message: '订单不存在'
          }
        }

        if (orderRes.data.status !== 'pending') {
          return {
            success: false,
          message: '订单已处理，无法取消'
          }
        }

        // 更新订单状态
        await db.collection('orders').doc(orderId).update({
          data: {
            status: 'cancelled',
            updateTime: db.serverDate()
          }
        })

        // 恢复书籍状态
        for (const item of orderRes.data.items) {
          await db.collection('books').doc(item.bookId).update({
            data: {
              status: 'available',
              buyerId: '',
              updateTime: db.serverDate()
            }
          })
        }

        // 减少买家的购买数量
        await db.collection('users').where({
          _openid: OPENID
        }).update({
          data: {
            booksBought: _.inc(-orderRes.data.items.length),
            updateTime: db.serverDate()
          }
        })

        return {
          success: true,
          message: '订单已取消'
        }
      }

      // 确认收货
      case 'confirm': {
        const { orderId } = data

        await db.collection('orders').doc(orderId).update({
          data: {
            status: 'completed',
            updateTime: db.serverDate()
          }
        })

        return {
          success: true,
          message: '订单已完成'
        }
      }

      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (error) {
    console.error('订单操作失败:', error)
    return {
      success: false,
      message: error.message || '操作失败',
      error: error
    }
  }
}
