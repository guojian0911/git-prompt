
export interface Category {
  value: string;    // 分类的唯一标识符，用于数据存储和查询
  label: string;    // 分类的显示名称
  icon: string;     // 分类的图标（emoji）
  count?: number;   // 该分类下的提示词数量（可选，由数据查询填充）
}

export const categories: Category[] = [
  { value: "chatgpt", label: "ChatGPT", icon: "🤖" },
  { value: "gpt-4", label: "GPT-4", icon: "🧠" },
  { value: "writing", label: "创意写作", icon: "✍️" },
  { value: "coding", label: "编程开发", icon: "💻" },
  { value: "business", label: "商业", icon: "💼" },
  { value: "education", label: "教育", icon: "📚" },
  { value: "marketing", label: "营销", icon: "📢" },
  { value: "creative", label: "创意", icon: "🎨" },
  { value: "productivity", label: "生产力", icon: "📊" },
  { value: "research", label: "研究", icon: "🔍" },
  { value: "product", label: "产品经理", icon: "📱" },
];
