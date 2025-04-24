import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PromptCard from "../prompts/PromptCard";
import CategoryButton from "../ui/CategoryButton";
import { supabase } from "@/integrations/supabase/client";

// Static creative writing prompt as example
const creativeWritingPrompt = {
  id: "creative-writing-example",
  title: "创意写作助手",
  description: "激发灵感，帮助创作者突破写作瓶颈，生成创意内容",
  content: "请作为我的创意写作助手。我正在寻找关于[主题]的创意写作灵感。请帮我：\n1. 提供3-5个独特的故事创意或角度\n2. 对于每个创意，给出一个引人入胜的开头段落\n3. 提供一些可能的角色描述和发展方向\n4. 建议一些可以增添深度的情节转折或隐喻\n5. 推荐适合这种写作的风格和语调\n\n尽量避免常见的比喻和陈词滥调，提供那些有创新性的、能引发读者共鸣的创意。",
  category: "创意写作",
  is_public: true,
  author: {
    name: "系统",
    avatar: ""
  },
  stats: {
    rating: 4.9,
    comments: 27,
    stars: 0
  }
};

// Mock data for categories (keep this for now)
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

  // Fetch public prompts
  const { data: publicPrompts = [], isLoading } = useQuery({
    queryKey: ['featured-prompts'],
    queryFn: async () => {
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      return prompts.map(prompt => ({
        ...prompt,
        author: {
          name: prompt.profiles?.username || 'Anonymous',
          avatar: prompt.profiles?.avatar_url
        }
      }));
    }
  });

  // Combine static prompt with fetched prompts
  const allPrompts = [creativeWritingPrompt, ...publicPrompts];

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
          {allPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              {...prompt}
              stats={{
                rating: 0,
                comments: 0,
                stars: prompt.stars_count
              }}
            />
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
