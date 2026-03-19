// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云函数
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取微信上下文，自动包含用户的 openid, appid, unionid
    const { OPENID, APPID, UNIONID } = cloud.getWXContext()

    console.log('用户登录信息:', { OPENID, APPID, UNIONID })

    // 初始化数据库
    const db = cloud.database()
    const _ = db.command

    // 查询用户是否已存在
    const userRes = await db.collection('users').where({
      _openid: OPENID
    }).get()

    let userInfo
    let isNewUser = false

    if (userRes.data.length === 0) {
      // 新用户，创建用户记录
      isNewUser = true
      const createRes = await db.collection('users').add({
        data: {
          _openid: OPENID,
          name: '微信用户',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 5.0,
          booksSold: 0,
          booksBought: 0,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })

      userInfo = {
        _id: createRes._id,
        _openid: OPENID,
        name: '微信用户',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 5.0,
        booksSold: 0,
        booksBought: 0
      }

      console.log('新用户创建成功:', userInfo)
    } else {
      // 老用户，更新最后登录时间
      const existingUser = userRes.data[0]
      await db.collection('users').doc(existingUser._id).update({
        data: {
          updateTime: db.serverDate()
        }
      })

      userInfo = existingUser
      console.log('用户已存在:', userInfo)
    }

    // 返回登录结果
    return {
      success: true,
      openid: OPENID,
      userInfo: userInfo,
      isNewUser: isNewUser,
      message: isNewUser ? '注册成功' : '登录成功'
    }
  } catch (error) {
    console.error('登录失败:', error)
    return {
      success: false,
      message: error.message || '登录失败',
      error: error
    }
  }
}
