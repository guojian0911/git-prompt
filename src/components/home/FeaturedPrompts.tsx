
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PromptCard from "../prompts/PromptCard";
import { usePublicPrompts } from "@/hooks/usePublicPrompts";
import { FeaturedHeader } from "./FeaturedHeader";
import { CategoriesSection } from "./CategoriesSection";

// Static creative writing prompt as example
const creativeWritingPrompt = {
  id: "creative-writing-example",
  title: "创意写作助手",
  description: "激发灵感，帮助创作者突破写作瓶颈，生成创意内容",
  content: "请作为我的创意写作助手。我正在寻找关于[主题]的创意写作灵感。请帮我：\n1. 提供3-5个独特的故事创意或角度\n2. 对于每个创意，给出一个引人入胜的开头段落\n3. 提供一些可能的角色描述和发展方向\n4. 建议一些可以增添深度的情节转折或隐喻\n5. 推荐适合这种写作的风格和语调\n\n尽量避免常见的比喻和陈词滥调，提供那些有创新性的、能引发读者共鸣的创意。",
  category: "创意写作",
  is_public: true,
  user_id: null,
  fork_from: null,
  author: {
    name: "系统",
    avatar: ""
  },
  stats: {
    rating: 4.9,
    comments: 27,
    stars: 0
  },
  tags: []
};

const FeaturedPrompts = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const navigate = useNavigate();
  const { data: publicPrompts = [] } = usePublicPrompts();

  // Handler for forking a prompt
  const handleForkPrompt = (prompt: any) => {
    navigate('/submit', { 
      state: { 
        forkedPrompt: {
          title: prompt.title,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          tags: prompt.tags || [],
          forkedFrom: prompt.id
        } 
      } 
    });
  };

  // Combine static prompt with fetched prompts
  const allPrompts = [creativeWritingPrompt, ...publicPrompts];

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FeaturedHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {allPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              {...prompt}
              onFork={() => handleForkPrompt(prompt)}
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

        <CategoriesSection />
      </div>
    </div>
  );
};

export default FeaturedPrompts;
