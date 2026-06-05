# 二手书商城小程序

这是一个基于微信小程序平台开发的**校园二手书交易平台**，旨在为大学生提供便捷的二手教材、参考书交易服务。通过整合微信生态，实现用户快速发布、浏览、购买二手书籍的闭环体验。

## 功能特性

- 📚 **书籍浏览** - 按分类浏览二手书籍
- 🔍 **智能搜索** - 支持关键词搜索书名、作者
- 🛒 **购物车** - 添加商品到购物车，批量结算
- 📦 **订单管理** - 查看和管理购买订单
- 📝 **发布书籍** - 轻松发布闲置教材
- 👤 **个人中心** - 管理个人信息和发布的书籍

## 技术栈

- **前端**: 微信小程序原生框架 (WXML + WXSS + JavaScript)
- **后端**: 微信云开发 (云函数 + 云数据库 + 云存储)
- **数据库**: MongoDB (云开发数据库)

## 项目结构

```
二手商城/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   ├── books/         # 书籍列表
│   ├── cart/          # 购物车
│   ├── publish/       # 发布书籍
│   └── profile/       # 个人中心
├── cloudfunctions/     # 云函数
│   ├── login/         # 登录
│   ├── book/          # 书籍管理
│   ├── cart/          # 购物车
│   └── order/         # 订单管理
└── components/         # 组件
    └── custom-tab-bar/ # 自定义TabBar
```

## 开发环境

- 微信开发者工具
- 小程序基础库 3.14.2
- 启用云开发

## 部署说明

1. 克隆项目
```bash
git clone https://github.com/htxda/secondhand-bookstore.git
```

2. 使用微信开发者工具打开项目

3. 配置云开发环境

4. 部署云函数

5. 运行项目

---

*原始 Figma 设计稿*: https://www.figma.com/design/pYtrD6S694HgiboGCQXl8i/二手教材交易小程序
<img width="530" height="1164" alt="7657204e3e8a03dd8b6317c3eea69c99" src="https://github.com/user-attachments/assets/f0c7f7bf-645c-44ad-84db-068b912b7233" />
<img width="538" height="1157" alt="692a5c8b7038b5ae73f95570baae8b4b" src="https://github.com/user-attachments/assets/7ebdd4ee-8996-4dcd-95fc-57d640614514" />
<img width="544" height="1175" alt="6d36ffb8bc3fddb5b549f1f33a8c2c86" src="https://github.com/user-attachments/assets/1388c39e-c504-4249-b0fc-43531b5be0e3" />
<img width="548" height="1172" alt="12031734e7183c116f996ec61d42b7ba" src="https://github.com/user-attachments/assets/dfc869c5-22f8-4f3f-a96f-344c832c2e88" />

