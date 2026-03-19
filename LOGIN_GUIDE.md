# 微信登录功能实现指南

## 功能说明

本项目已实现完整的微信小程序登录注册功能，基于腾讯云 CloudBase 云开发服务。

## 核心特性

✅ **自动认证**：小程序天然登录，无需复杂的 OAuth 流程
✅ **用户身份验证**：通过云函数自动获取并验证用户的 OPENID
✅ **用户数据管理**：自动创建和更新用户记录
✅ **本地缓存**：登录状态和用户信息本地存储
✅ **退出登录**：支持安全退出并清除数据

## 实现原理

### 1. 认证流程

```
用户点击登录
    ↓
调用 wx.cloud.callFunction('login')
    ↓
云函数获取 OPENID (微信自动注入)
    ↓
查询数据库，判断新用户/老用户
    ↓
返回用户信息和登录状态
    ↓
前端保存到本地缓存并更新 UI
```

### 2. 核心文件

#### 前端文件

1. **app.js** - CloudBase 初始化
   - 在 `onLaunch` 中初始化 `wx.cloud`
   - 设置环境 ID 和用户追踪

2. **pages/profile/profile.js** - 登录逻辑
   - `login()` 方法：调用云函数进行登录
   - `logout()` 方法：退出登录
   - `checkUserLogin()` 方法：检查登录状态

3. **pages/profile/profile.wxml** - 登录按钮
   - 显示"微信一键登录"或"退出登录"按钮
   - 根据 `isLoggedIn` 状态动态切换

#### 云函数

1. **cloudfunctions/login/** - 登录云函数
   - 获取用户 OPENID
   - 查询或创建用户记录
   - 返回用户信息

2. **cloudfunctions/updateUserInfo/** - 更新用户信息
   - 更新用户昵称和头像
   - 记录更新时间

### 3. 数据库结构

**集合名称：users**

```javascript
{
  _id: "记录ID",
  _openid: "用户OPENID",
  name: "用户昵称",
  avatar: "用户头像URL",
  rating: 5.0,
  booksSold: 0,
  booksBought: 0,
  createTime: "创建时间",
  updateTime: "更新时间"
}
```

## 部署步骤

### 步骤 1：配置 CloudBase 环境

1. 登录 [腾讯云 CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 创建或选择一个云开发环境
3. 获取环境 ID（格式：`your-env-id`）

### 步骤 2：修改配置

1. 打开 `app.js` 文件
2. 找到第 7 行，修改环境 ID：

```javascript
wx.cloud.init({
  env: '二手商城-12345678', // ⚠️ 替换为你的 CloudBase 环境 ID
  traceUser: true
})
```

3. 保存文件

### 步骤 3：创建数据库集合

1. 进入 CloudBase 控制台 → 数据库
2. 创建集合 `users`（用户表）
3. **重要**：设置数据库权限规则

#### 数据库权限规则配置

在 CloudBase 控制台中，为 `users` 集合设置以下权限规则：

```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

**说明**：
- 用户只能读取自己的数据
- 用户只能修改自己的数据
- 云函数不受此限制（有更高权限）

### 步骤 4：上传云函数

#### 方法一：使用微信开发者工具

1. 打开微信开发者工具
2. 找到 `cloudfunctions/login` 目录
3. 右键点击，选择"上传并部署：云端安装依赖"
4. 等待部署完成
5. 对 `cloudfunctions/updateUserInfo` 重复相同步骤

#### 方法二：使用 CloudBase CLI

```bash
# 安装 CloudBase CLI（如果未安装）
npm install -g @cloudbase/cli

# 登录 CloudBase
tcb login

# 部署云函数
cd cloudfunctions/login
npm install
cd ../..
tcb functions:deploy login

cd cloudfunctions/updateUserInfo
npm install
cd ../..
tcb functions:deploy updateUserInfo
```

### 步骤 5：测试登录

1. 在微信开发者工具中运行项目
2. 进入"我的"页面
3. 点击"微信一键登录"按钮
4. 观察控制台输出和页面状态变化

## API 说明

### 云函数：login

**功能**：用户登录或注册

**请求参数**：无

**响应结果**：

```javascript
{
  success: true,
  openid: "用户OPENID",
  userInfo: {
    _id: "记录ID",
    _openid: "用户OPENID",
    name: "微信用户",
    avatar: "头像URL",
    rating: 5.0,
    booksSold: 0,
    booksBought: 0
  },
  isNewUser: false,
  message: "登录成功"
}
```

### 云函数：updateUserInfo

**功能**：更新用户昵称和头像

**请求参数**：

```javascript
{
  userInfo: {
    nickName: "用户昵称",
    avatarUrl: "头像URL"
  }
}
```

**响应结果**：

```javascript
{
  success: true,
  message: "更新成功",
  data: {...}
}
```

## 使用示例

### 前端调用登录

```javascript
// pages/profile/profile.js
login() {
  wx.cloud.callFunction({
    name: 'login',
    success: res => {
      if (res.result.success) {
        const { openid, userInfo } = res.result;
        wx.setStorageSync('openid', openid);
        wx.setStorageSync('userInfo', userInfo);
        // 更新 UI...
      }
    }
  });
}
```

### 云函数获取用户身份

```javascript
// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  // 获取用户 OPENID（微信自动注入，无需手动传参）
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()

  // 使用 OPENID 进行数据库操作
  const db = cloud.database()
  const user = await db.collection('users').where({
    _openid: OPENID
  }).get()

  return user
}
```

## 注意事项

### ⚠️ 重要提示

1. **环境 ID 必须正确**：`app.js` 中的环境 ID 必须与 CloudBase 控制台一致

2. **数据库权限**：必须设置正确的数据库权限规则，否则会报错

3. **云函数部署**：云函数修改后必须重新部署才能生效

4. **小程序 AppID**：确保 `project.config.json` 中的 appid 正确配置

5. **云开发环境**：确保小程序已关联到 CloudBase 环境

### 常见问题

#### 问题 1：登录失败，提示"云函数未找到"

**解决方案**：
- 检查云函数是否已部署
- 确认云函数名称是否正确
- 查看 CloudBase 控制台的云函数列表

#### 问题 2：数据库操作失败

**解决方案**：
- 检查数据库集合 `users` 是否已创建
- 确认数据库权限规则是否正确设置
- 查看 CloudBase 控制台的数据库日志

#### 问题 3：获取不到 OPENID

**解决方案**：
- 确认 CloudBase 已正确初始化
- 检查环境 ID 是否正确
- 确认小程序已关联 CloudBase 环境

## 扩展功能建议

### 1. 用户资料完善

可以在登录后让用户补充更多信息：

```javascript
// 获取用户头像和昵称（使用新 API）
wx.chooseAvatar({
  success: (res) => {
    const avatarUrl = res.tempFilePath
    // 上传到云存储
    wx.cloud.uploadFile({
      cloudPath: `avatars/${openid}.jpg`,
      filePath: avatarUrl,
      success: uploadRes => {
        // 更新用户头像
        wx.cloud.callFunction({
          name: 'updateUserInfo',
          data: { userInfo: { avatarUrl: uploadRes.fileID } }
        })
      }
    })
  }
})
```

### 2. 手机号授权

```javascript
<button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber">
  获取手机号
</button>
```

### 3. 用户积分系统

在数据库中添加积分字段，登录时增加积分。

## 技术支持

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [微信小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [CloudBase 控制台](https://console.cloud.tencent.com/tcb)

## 更新日志

- **2026-02-25**：初始化版本
  - 实现基础登录功能
  - 创建用户数据库结构
  - 添加退出登录功能
