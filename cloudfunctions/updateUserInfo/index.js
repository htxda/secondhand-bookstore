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

    // 获取前端传来的用户信息
    const { userInfo } = event

    console.log('更新用户信息:', { OPENID, userInfo })

    // 初始化数据库
    const db = cloud.database()

    // 更新用户信息
    const updateRes = await db.collection('users').where({
      _openid: OPENID
    }).update({
      data: {
        name: userInfo.nickName || userInfo.name,
        avatar: userInfo.avatarUrl,
        updateTime: db.serverDate()
      }
    })

    console.log('用户信息更新成功:', updateRes)

    return {
      success: true,
      message: '更新成功',
      data: updateRes
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return {
      success: false,
      message: error.message || '更新失败',
      error: error
    }
  }
}
