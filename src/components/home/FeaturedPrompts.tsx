
import { Link } from "react-router-dom";
import PromptCard from "../prompts/PromptCard";
import { usePublicPrompts } from "@/hooks/usePublicPrompts";
import { FeaturedHeader } from "./FeaturedHeader";
import { CategoriesSection } from "./CategoriesSection";

const FeaturedPrompts = () => {
  // 移除 navigate，因为不再需要导航到 Fork 页面
  const { data: publicPrompts = [] } = usePublicPrompts();

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FeaturedHeader activeTab="featured" onTabChange={() => {}} />

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[...publicPrompts].map((prompt) => (
            <PromptCard
              key={prompt.id}
              {...prompt}
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
