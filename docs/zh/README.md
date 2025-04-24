
# Prompt Hub - AI 提示词共享平台

## 项目概述

Prompt Hub 是一个用于创建、分享和发现高质量 AI 提示词的协作平台。该应用程序允许用户构建个人的有效提示词集合，与社区分享，并发现其他用户创建的提示词。

**项目地址**: https://lovable.dev/projects/fc5b528f-b2c0-45b2-bf2d-45148494d746

## 核心功能

- **提示词创建与管理**: 创建、编辑和组织您的 AI 提示词
- **社区共享**: 与社区分享提示词并发现其他用户的提示词
- **分类与标签**: 通过分类和标签浏览提示词，快速找到所需内容
- **交互功能**: 标星、复制和评论提示词
- **用户档案**: 个性化用户档案，包含活动追踪

## 技术栈

本项目使用以下技术构建：

- **前端**: React, TypeScript, Tailwind CSS, shadcn/ui
- **构建工具**: Vite
- **后端**: Supabase (身份验证、数据库、存储)
- **状态管理**: TanStack Query
- **路由**: React Router

## 快速开始

### 使用 Lovable

直接访问 [Lovable 项目](https://lovable.dev/projects/fc5b528f-b2c0-45b2-bf2d-45148494d746) 并开始使用。

通过 Lovable 进行的更改将自动提交到此仓库。

### 本地开发

如果您想使用自己的 IDE 在本地工作：

```sh
# 第 1 步：克隆仓库。
git clone <您的_GIT_URL>

# 第 2 步：进入项目目录。
cd <您的项目名称>

# 第 3 步：安装必要的依赖。
npm i

# 第 4 步：启动开发服务器，支持自动重新加载和即时预览。
npm run dev
```

### 在 GitHub 中编辑

- 导航到所需文件
- 点击文件视图顶部右侧的"编辑"按钮（铅笔图标）
- 进行更改并提交更改

### 使用 GitHub Codespaces

- 导航到仓库主页
- 点击右上角附近的"Code"按钮（绿色按钮）
- 选择"Codespaces"标签
- 点击"New codespace"启动新的 Codespace 环境
- 在 Codespace 中直接编辑文件，完成后提交并推送更改

## 部署

只需打开 [Lovable](https://lovable.dev/projects/fc5b528f-b2c0-45b2-bf2d-45148494d746) 并点击 Share -> Publish。

## 自定义域名设置

要连接域名，导航到 Project > Settings > Domains 并点击 Connect Domain。

更多信息请阅读：[设置自定义域名](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 数据库架构

项目使用 Supabase 数据库，包含以下主要表：

- `prompts`: 存储所有用户创建的提示词
- `profiles`: 包含用户档案信息
- `prompt_stars`: 追踪用户标星的提示词
- `shared_prompts`: 记录已共享给特定用户的提示词
- `tutorials`: 与提示工程相关的教育内容

详细的数据库结构概览，请参见 [数据库结构](./database-structure.md)

## 贡献

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加一些神奇的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

