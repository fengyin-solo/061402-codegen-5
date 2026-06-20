# 后台管理系统

一个基于 Vue 3 + Element Plus + Pinia + Vue Router 的现代化后台管理系统。

## 功能特性

### 🎯 核心功能

- **仪表盘**：实时数据统计、销售趋势图表、订单状态分布
- **用户管理**：用户列表、用户详情、创建/编辑用户、批量操作
- **产品管理**：产品列表、产品分类、库存管理、状态管理
- **订单管理**：订单列表、订单详情、状态更新、订单统计
- **系统设置**：主题切换、语言设置、权限管理、系统配置

### 🛠️ 技术栈

- **前端框架**：Vue 3.5+
- **UI 组件库**：Element Plus
- **状态管理**：Pinia
- **路由管理**：Vue Router 4
- **构建工具**：Vite 5
- **HTTP 客户端**：Fetch API（封装）
- **开发语言**：JavaScript + TypeScript 类型定义

### 📦 项目结构

```
src/
├── api/                 # API 接口层
│   ├── dashboard.js     # 仪表盘相关接口
│   ├── user.js          # 用户管理接口
│   ├── product.js       # 产品管理接口
│   └── order.js         # 订单管理接口
├── components/          # 组件库
│   ├── Common/          # 通用组件
│   ├── User/            # 用户相关组件
│   ├── Product/         # 产品相关组件
│   └── Order/           # 订单相关组件
├── layouts/             # 布局组件
│   ├── MainLayout.vue   # 主布局
│   └── components/      # 布局子组件
│       ├── Sidebar.vue  # 侧边栏
│       ├── Navbar.vue   # 顶部导航栏
│       └── TagsView.vue # 标签页
├── router/              # 路由配置
│   └── index.js         # 路由定义
├── store/               # 状态管理
│   ├── index.js         # Pinia 入口
│   └── modules/         # 状态模块
│       ├── app.js       # 应用状态
│       ├── user.js      # 用户状态
│       ├── product.js   # 产品状态
│       └── order.js     # 订单状态
├── views/               # 页面视图
│   ├── Dashboard/       # 仪表盘
│   ├── UserManagement/  # 用户管理
│   ├── ProductManagement/ # 产品管理
│   ├── OrderManagement/ # 订单管理
│   ├── Settings/        # 系统设置
│   ├── Login/           # 登录页面
│   └── NotFound/        # 404页面
├── utils/               # 工具函数
│   ├── request.js       # HTTP 请求封装
│   └── common.js        # 通用工具函数
├── types/               # TypeScript 类型定义
│   └── index.ts         # 全局类型定义
├── App.vue              # 根组件
├── main.js              # 应用入口
└── style.css            # 全局样式
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 开发规范

### 代码风格

- 使用 ES6+ 语法
- 使用 Composition API（`<script setup>`）
- 组件名使用 PascalCase
- 文件命名使用 kebab-case

### 状态管理规范

- 使用 Pinia 进行状态管理
- 按业务模块划分状态
- 异步操作放在 actions 中
- 使用 getters 进行派生状态计算

### API 规范

- 统一封装 HTTP 请求
- 使用 RESTful API 设计风格
- 统一错误处理和响应格式

### 路由规范

- 按业务模块组织路由
- 使用路由守卫进行权限控制
- 合理使用懒加载优化性能

## 功能模块详解

### 仪表盘

- 统计卡片：用户数、产品数、订单数、总收入
- 销售趋势图表：支持按周/月/季度/年查看
- 订单状态分布：饼图展示各状态订单占比
- 最近订单列表：快速查看最新订单
- 热门产品排行：按销量和收入排序

### 用户管理

- 用户列表展示：支持分页、搜索、筛选
- 用户详情查看：完整的用户信息
- 用户创建/编辑：表单验证、权限设置
- 批量操作：批量删除、批量状态更新
- 角色权限管理：支持多角色权限控制

### 产品管理

- 产品列表：支持分类筛选、状态筛选
- 产品详情：完整的产品信息和库存状态
- 产品创建/编辑：富文本描述、图片上传
- 分类管理：动态添加产品分类
- 库存预警：低库存自动提醒

### 订单管理

- 订单列表：按状态、时间、金额筛选
- 订单详情：完整的订单信息和商品列表
- 状态更新：支持从创建到完成的全流程管理
- 订单统计：销售数据、客户分析
- 导出功能：支持导出订单数据为 Excel

## 配置说明

### 环境变量

在 `.env` 文件中配置：

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=后台管理系统
VITE_PORT=5173
```

### 主题配置

支持亮色/暗色主题切换，可在系统设置中配置。

### 多语言支持

支持中文/英文切换，可在顶部导航栏切换。

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至 admin@example.com

---

**注意**：这是一个演示项目，生产环境使用前请进行安全加固和性能优化。