import { useState } from "react";
import { Link } from "react-router-dom";
import PromptCard from "../prompts/PromptCard";
import CategoryButton from "../ui/CategoryButton";

// Mock data for prompts
const featuredPrompts = [
  {
    id: "1",
    title: "有效的会议总结助手",
    description: "帮助用户总结会议内容，提取关键点和行动项目",
    content: "我需要你充当会议总结助手。我会提供会议的对话内容，你需要：\n1. 提炼出会议的主要议题\n2. 列出讨论的关键点\n3. 整理所有的决定事项\n4. 标记所有的行动项和负责人\n5. 提供一个简洁的总体总结\n请以结构化的方式整理这些信息，使其易于阅读和理解。",
    category: "工作效率",
    is_public: false,
    author: {
      name: "张明",
      avatar: ""
    },
    stats: {
      rating: 4.9,
      comments: 23
    }
  },
  {
    id: "2",
    title: "代码重构专家",
    description: "帮助开发者重构和优化代码，提高代码质量和可维护性",
    content: "请担任代码重构专家。我会提供一段代码，你需要：\n1. 分析代码中的潜在问题和优化空间\n2. 提供重构建议，包括设计模式应用、代码结构优化等\n3. 重写代码，确保功能不变的前提下提高其可读性、可维护性和效率\n4. 解释你所做的变更和原因\n\n下面是需要重构的代码：[代码将在此处粘贴]",
    category: "编程开发",
    is_public: true,
    author: {
      name: "李华",
      avatar: ""
    },
    stats: {
      rating: 4.8,
      comments: 19
    }
  },
  {
    id: "3",
    title: "个性化学习计划生成器",
    description: "根据用户的学习目标、时间和偏好生成定制化学习计划",
    content: "我希望你能为我创建一个个性化学习计划。请基于以下信息：\n1. 学习目标：[目标]\n2. 当前知识水平：[初级/中级/高级]\n3. 可用时间：每周[小时数]小时\n4. 偏好的学习方式：[视频/阅读/实践项目等]\n5. 截止日期：[若有]\n\n提供一个详细的学习计划，包括：\n- 阶段性目标\n- 每周学习内容分配\n- 推荐的学习资源\n- 如何评估学习进度\n- 潜在的学习挑战和应对策略",
    category: "教育学习",
    is_public: false,
    author: {
      name: "王芳",
      avatar: ""
    },
    stats: {
      rating: 4.7,
      comments: 31
    }
  },
  {
    id: "4",
    title: "创意写作助手",
    description: "激发灵感，帮助创作者突破写作瓶颈，生成创意内容",
    content: "请作为我的创意写作助手。我正在寻找关于[主题]的创意写作灵感。请帮我：\n1. 提供3-5个独特的故事创意或角度\n2. 对于每个创意，给出一个引人入胜的开头段落\n3. 提供一些可能的角色描述和发展方向\n4. 建议一些可以增添深度的情节转折或隐喻\n5. 推荐适合这种写作的风格和语调\n\n尽量避免常见的比喻和陈词滥调，提供那些有创新性的、能引发读者共鸣的创意。",
    category: "创意写作",
    is_public: true,
    author: {
      name: "赵静",
      avatar: ""
    },
    stats: {
      rating: 4.9,
      comments: 27
    }
  }
];

// Mock data for categories
const categories = [
  { name: "工作效率", icon: "📊", slug: "productivity", count: 124 },
  { name: "创意写作", icon: "✍️", slug: "creative-writing", count: 98 },
  { name: "编程开发", icon: "💻", slug: "programming", count: 156 },
  { name: "教育学习", icon: "📚", slug: "education", count: 87 },
  { name: "数据分析", icon: "📈", slug: "data-analysis", count: 65 },
  { name: "生活助手", icon: "🏠", slug: "lifestyle", count: 112 }
];

const FeaturedPrompts = () => {
  const [activeTab, setActiveTab] = useState("featured");

  // Filter out private prompts
  const publicPrompts = featuredPrompts.filter(prompt => prompt.is_public);

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">探索提示词</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            发现社区创建的高质量提示词，提升您与AI的交互体验
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
            {["featured", "recent", "popular"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-slate-700 text-shumer-purple shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "featured" ? "精选" : tab === "recent" ? "最新" : "热门"}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {publicPrompts.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mb-16">
          <Link
            to="/prompts"
            className="btn-outline inline-flex items-center justify-center"
          >
            浏览全部提示词
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Categories Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">浏览分类</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            按照不同的类别浏览提示词，满足您的特定需求
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryButton 
              key={index} 
              {...category} 
            />
          ))}
        </div>
        
        {/* View All Categories */}
        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="text-shumer-purple hover:text-shumer-blue transition-colors inline-flex items-center"
          >
            查看全部分类
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPrompts;
