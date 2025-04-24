
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PromptCard from "../prompts/PromptCard";
import { usePublicPrompts } from "@/hooks/usePublicPrompts";
import { FeaturedHeader } from "./FeaturedHeader";
import { CategoriesSection } from "./CategoriesSection";

const FeaturedPrompts = () => {
  const navigate = useNavigate();
  const { data: publicPrompts = [] } = usePublicPrompts();

  // Update to match detail page fork logic
  const handleForkPrompt = (prompt: any) => {
    navigate('/submit', { 
      state: { 
        forkedPrompt: {
          title: `Copy of ${prompt.title}`,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          tags: prompt.tags || [],
          forkedFrom: prompt.id
        } 
      } 
    });
    
    // Add toast notification for user feedback
    if (window.Sonner) {
      window.Sonner.toast.info("已创建提示词副本，您可以在此基础上修改后提交");
    }
  };

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FeaturedHeader activeTab="featured" onTabChange={() => {}} />

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[...publicPrompts].map((prompt) => (
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
