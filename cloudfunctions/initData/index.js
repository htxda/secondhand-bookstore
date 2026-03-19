// 初始化示例数据云函数（已废弃，请使用小程序发布功能）
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  try {
    const db = cloud.database()

    // 检查是否已经初始化
    const booksRes = await db.collection('books').limit(1).get()

    if (booksRes.data.length > 0) {
      return {
        success: false,
        message: '数据已初始化'
      }
    }

    // 获取调用者的 openid（只有登录用户才能调用）
    const { OPENID } = cloud.getWXContext()

    if (!OPENID) {
      return {
        success: false,
        message: '请先登录'
      }
    }

    // 添加示例书籍
    const sampleBooks = [
      {
        _openid: OPENID,
        sellerId: OPENID,
        title: '高等数学（上册）',
        author: '同济大学数学系',
        category: 'math',
        subject: '数学',
        condition: '良好',
        price: 25,
        originalPrice: 45,
        description: '全新，只有少量笔记',
        image: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMHRleHRib29rJTIwdW5pdmVyc2l0eXxlbnwxfHx8fDE3NzE5NDEyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'available',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      },
      {
        _openid: OPENID,
        sellerId: OPENID,
        title: '大学英语综合教程2',
        author: '何兆熊',
        category: 'english',
        subject: '英语',
        condition: '几乎全新',
        price: 20,
        originalPrice: 38,
        description: '书页干净，无涂写',
        image: 'https://images.unsplash.com/photo-1646495785840-7ff6be438d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGFuZ3VhZ2UlMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NzE5NDEyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'available',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      },
      {
        _openid: OPENID,
        sellerId: OPENID,
        title: 'C程序设计（第5版）',
        author: '谭浩强',
        category: 'computer',
        subject: '计算机',
        condition: '良好',
        price: 30,
        originalPrice: 52,
        description: '经典教材，适合初学者',
        image: 'https://images.unsplash.com/photo-1732304722020-be33345c00c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwYm9va3xlbnwxfHx8fDE3NzE4ODUwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'available',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    ]

    // 批量添加书籍
    for (const book of sampleBooks) {
      await db.collection('books').add({
        data: book
      })
    }

    return {
      success: true,
      message: '示例数据初始化成功'
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
    return {
      success: false,
      message: error.message || '初始化失败'
    }
  }
}
