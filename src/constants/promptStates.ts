// 提示词状态常量
export enum PromptState {
  NORMAL = 0,      // 正常状态
  DELETED = 1,     // 已删除（逻辑删除）
  // 以下是未来可能的扩展状态
  // ARCHIVED = 2,    // 已归档
  // PENDING = 3,     // 待审核
  // REJECTED = 4,    // 审核拒绝
  // FEATURED = 5,    // 精选推荐
}
