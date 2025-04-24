# 项目数据库结构和交互流程

## 数据库表结构

本项目使用 Supabase 作为后端数据库服务，以下是当前使用的主要表结构：

### 1. 提示词相关表（Prompts）

#### `prompts` 表
存储所有用户创建的提示词（Prompts）
- `id`: UUID, 主键
- `user_id`: UUID, 关联到创建提示词的用户
- `title`: 提示词标题
- `description`: 提示词描述
- `content`: 提示词内容
- `category`: 提示词分类
- `tags`: 标签数组
- `example_output`: 示例输出（可为空）
- `is_public`: 是否公开
- `created_at`: 创建时间
- `updated_at`: 更新时间
- `fork_from`: 若为复制而来，存储原提示词ID
- `view_count`: 查看次数
- `stars_count`: 星标数
- `fork_count`: 复制次数
- `share_count`: 分享次数

#### `shared_prompts` 表
存储提示词的分享记录
- `id`: UUID, 主键
- `prompt_id`: 被分享的提示词ID
- `shared_by`: 分享者的用户ID
- `shared_with`: 被分享给的用户ID
- `created_at`: 分享时间

#### `starred_prompts` 表
存储用户收藏的提示词
- `id`: UUID, 主键
- `user_id`: 收藏提示词的用户ID
- `prompt_id`: 被收藏的提示词ID
- `created_at`: 创建时间

### 2. 用户相关表

#### `profiles` 表
存储用户的个人信息
- `id`: UUID, 主键，关联到 auth.users 表
- `username`: 用户名
- `avatar_url`: 头像URL
- `provider`: 认证提供者
- `provider_id`: 认证提供者ID
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 3. 教程相关表

#### `tutorials` 表
存储教程信息
- `id`: UUID, 主键
- `user_id`: 创建教程的用户ID
- `title`: 教程标题
- `source_type`: 源类型
- `source_url`: 源URL
- `language`: 语言
- `status`: 状态
- `is_public`: 是否公开
- `view_count`: 查看次数
- `config`: 配置信息
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### `chapters` 表
存储教程章节
- `id`: UUID, 主键
- `tutorial_id`: 关联的教程ID
- `number`: 章节编号
- `title`: 章节标题
- `storage_path`: 存储路径
- `created_at`: 创建时间

## 数据库交互流程

### 1. 用户认证流程

1. 用户通过 Supabase Auth 服务进行注册/登录
2. 登录成功后，Supabase 返回用户信息和会话令牌
3. 前端存储会话信息，用于后续请求的身份验证
4. 用户信息存储在 AuthContext 中，供全局访问

```typescript
// 示例代码 - 用户登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password,
});

// 用户登出
await supabase.auth.signOut();
```

### 2. 提示词（Prompt）数据操作流程

#### 创建提示词
1. 用户在提交表单中填写提示词信息
2. 前端通过 usePromptForm hook 处理表单提交
3. 数据通过 Supabase 客户端发送到后端并存储在 prompts 表中

```typescript
// 示例代码 - 创建提示词
const { error } = await supabase.from("prompts").insert({
  user_id: user.id,
  title: data.title,
  description: data.description,
  content: data.content,
  category: data.category,
  tags: data.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
  example_output: data.example_output || null,
  is_public: data.is_public,
});
```

#### 查询提示词
1. 组件挂载时，通过 React Query 的 useQuery hook 发送请求
2. Supabase 客户端执行查询并返回结果
3. 结果存储在 React Query 的缓存中，组件重新渲染展示数据

```typescript
// 示例代码 - 查询提示词
const { data: prompts } = useQuery({
  queryKey: ['prompts', userId, filter, page],
  queryFn: async () => {
    let query = supabase.from('prompts').select('*').eq('user_id', userId);
    // ... 根据过滤条件修改查询
    const { data, error } = await query.range((page - 1) * perPage, page * perPage - 1);
    if (error) throw error;
    return data;
  }
});
```

#### 分享提示词
1. 用户点击分享按钮，打开分享对话框
2. 输入目标用户名称
3. 前端通过 Supabase 客户端将分享记录插入 shared_prompts 表
4. 同时更新原提示词的分享计数

```typescript
// 示例代码 - 分享提示词
const { error } = await supabase.from('shared_prompts').insert({
  prompt_id: promptId,
  shared_by: user.id,
  shared_with: targetUser.id
});
```

### 3. 用户个人资料操作流程

1. 用户登录后，系统自动获取用户的个人资料信息
2. 数据从 profiles 表中查询
3. 展示在用户界面上，如个人资料页面

```typescript
// 示例代码 - 获取用户资料
const { data: profile } = await supabase
  .from('profiles')
  .select('username, avatar_url')
  .eq('id', userId)
  .single();
```

## 数据权限控制

本项目使用 Supabase 的行级安全性（Row Level Security, RLS）来控制数据访问权限：

1. 每个用户只能访问、修改自己创建的提示词
2. 公开的提示词可以被所有用户查看
3. 私有提示词只能被创建者和被分享的用户访问
4. 用户个人资料信息受到保护，只有自己能够修改

这种设计确保了数据的安全性和隐私性，同时允许用户根据需要共享和协作。

## 前端数据流

1. `AuthContext`: 全局管理用户认证状态
2. React Query: 用于数据获取、缓存和状态管理
3. 组件级状态: 管理UI相关的临时状态

前端与数据库的交互主要通过 Supabase 客户端进行，使用 React Query 来优化数据获取和缓存策略，提高应用性能和用户体验。
