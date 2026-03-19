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

    console.log('书籍操作:', { OPENID, action, data })

    // 初始化数据库
    const db = cloud.database()
    const _ = db.command

    switch (action) {
      // 发布书籍
      case 'publish': {
        const { title, author, category, subject, condition, price, originalPrice, description, image } = data

        if (!title || !price || !image) {
          return {
            success: false,
            message: '请填写必填信息'
          }
        }

        // 发布书籍
        const bookRes = await db.collection('books').add({
          data: {
            _openid: OPENID,
            sellerId: OPENID,
            title: title,
            author: author || '未知作者',
            category: category || 'other',
            subject: subject || category || '其他',
            condition: condition || '良好',
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice) || parseFloat(price),
            description: description || '暂无描述',
            image: image,
            status: 'available', // available, sold, removed
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        })

        // 更新用户的发布数量
        await db.collection('users').where({
          _openid: OPENID
        }).update({
          data: {
            booksPublished: _.inc(1),
            updateTime: db.serverDate()
          }
        })

        return {
          success: true,
          message: '发布成功',
          data: {
            bookId: bookRes._id
          }
        }
      }

      // 获取书籍列表
      case 'getList': {
        const { category, keyword, status = 'available', limit } = data

        let query = db.collection('books')

        // 添加状态过滤
        query = query.where({ status: status })

        // 添加分类过滤（注意：使用 subject 字段）
        if (category && category !== 'all') {
          query = query.where({ subject: category })
        }

        // 添加关键词搜索（搜索多个字段）
        if (keyword) {
          query = query.where(_.or([
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
              subject: db.RegExp({
                regexp: keyword,
                options: 'i'
              })
            }
          ]))
        }

        // 添加限制数量
        if (limit) {
          query = query.limit(limit)
        }

        const res = await query.orderBy('createTime', 'desc').get()

        return {
          success: true,
          data: res.data
        }
      }

      // 获取书籍详情
      case 'getDetail': {
        console.log('getDetail data:', data);
        const { bookId } = data || { bookId: null };
        console.log('getDetail bookId:', bookId);

        if (!bookId) {
          return {
            success: false,
            message: 'bookId 不能为空'
          };
        }

        const res = await db.collection('books').doc(bookId).get()

        if (!res.data) {
          return {
            success: false,
            message: '书籍不存在'
          }
        }

        // 获取卖家信息
        const sellerRes = await db.collection('users').where({
          _openid: res.data.sellerId
        }).get()

        return {
          success: true,
          data: {
            ...res.data,
            seller: sellerRes.data[0] || null
          }
        }
      }

      // 获取我的发布
      case 'getMyBooks': {
        const { status } = data

        let query = db.collection('books').where({
          _openid: OPENID
        })

        if (status) {
          query = query.where({ status: status })
        }

        const res = await query.orderBy('createTime', 'desc').get()

        return {
          success: true,
          data: res.data
        }
      }

      // 更新书籍状态（下架）
      case 'updateStatus': {
        const { bookId, status } = data

        await db.collection('books').doc(bookId).update({
          data: {
            status: status,
            updateTime: db.serverDate()
          }
        })

        return {
          success: true,
          message: '状态已更新'
        }
      }

      // 删除书籍
      case 'delete': {
        const { bookId } = data

        await db.collection('books').doc(bookId).remove()

        return {
          success: true,
          message: '书籍已删除'
        }
      }

      default:
        return {
          success: false,
          message: '未知操作'
        }
    }
  } catch (error) {
    console.error('书籍操作失败:', error)
    return {
      success: false,
      message: error.message || '操作失败',
      error: error
    }
  }
}
