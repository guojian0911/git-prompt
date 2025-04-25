import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryButton from "@/components/ui/CategoryButton";
import PromptCard from "@/components/prompts/PromptCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { categories, Category } from "@/constants/categories";
import { supabase } from "@/integrations/supabase/client";

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  is_public: boolean;
  user_id: string;
  fork_from?: string | null;
  stars_count?: number;
  fork_count?: number;
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  stats?: {
    rating: number;
    comments: number;
    stars?: number;
    forks?: number;
  };
}

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 获取所有公开的提示词
  const { data: prompts = [], isLoading } = useQuery<Prompt[]>({
    queryKey: ['prompts', 'public'],
    queryFn: async () => {
      try {
        const { data: promptsData, error } = await supabase
          .from('prompts')
          .select(`
            id,
            title,
            description,
            content,
            category,
            is_public,
            user_id,
            fork_from,
            stars_count,
            fork_count,
            tags
          `)
          .eq('is_public', true);

        if (error) {
          console.error("Error fetching prompts:", error);
          throw error;
        }

        // 获取每个提示词作者的信息
        const promptsWithProfiles = await Promise.all(
          promptsData.map(async (prompt) => {
            let username = 'Anonymous';
            let avatar_url = null;

            if (prompt.user_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', prompt.user_id)
                .single();

              if (profile) {
                username = profile.username || 'Anonymous';
                avatar_url = profile.avatar_url;
              }
            }

            return {
              ...prompt,
              author: {
                name: username,
                avatar: avatar_url
              },
              stats: {
                rating: 0,
                comments: 0,
                stars: prompt.stars_count || 0,
                forks: prompt.fork_count || 0
              }
            };
          })
        );

        return promptsWithProfiles;
      } catch (error) {
        console.error("Error processing prompts:", error);
        return [];
      }
    }
  });

  // 计算每个分类的提示词数量
  const categoriesWithCount = useMemo(() => {
    const countMap: Record<string, number> = {};

    // 统计每个分类的提示词数量
    prompts.forEach(prompt => {
      if (prompt.category) {
        countMap[prompt.category] = (countMap[prompt.category] || 0) + 1;
      }
    });

    // 将统计结果添加到分类数据中
    return categories.map(category => ({
      ...category,
      count: countMap[category.value] || 0
    }));
  }, [prompts]);

  // 根据选中的分类和搜索关键词过滤提示词
  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [prompts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">浏览提示词分类</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            探索不同类别的AI提示词，找到最适合您需求的提示词
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="搜索提示词..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <CategoryButton
            key="all"
            name="全部"
            icon="🔍"
            slug="all"
            count={prompts.length}
            isSelected={!selectedCategory}
            onClick={() => setSelectedCategory(null)}
          />
          {categoriesWithCount.map((category) => (
            <CategoryButton
              key={category.value}
              name={category.label}
              icon={category.icon}
              slug={category.value}
              count={category.count || 0}
              isSelected={selectedCategory === category.value}
              onClick={() => setSelectedCategory(category.value)}
            />
          ))}
        </div>

        {/* Filtered Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              description={prompt.description}
              content={prompt.content}
              category={prompt.category}
              is_public={prompt.is_public}
              user_id={prompt.user_id}
              fork_from={prompt.fork_from}
              author={prompt.author || { name: 'Anonymous' }}
              stats={prompt.stats || { rating: 0, comments: 0 }}
              tags={prompt.tags}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              未找到匹配的提示词，请尝试其他搜索条件
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
