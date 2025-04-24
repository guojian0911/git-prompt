import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryButton from "@/components/ui/CategoryButton";
import PromptCard from "@/components/prompts/PromptCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock categories data (same as in FeaturedPrompts)
const categories = [
  { name: "工作效率", icon: "📊", slug: "productivity", count: 124 },
  { name: "创意写作", icon: "✍️", slug: "creative-writing", count: 98 },
  { name: "编程开发", icon: "💻", slug: "programming", count: 156 },
  { name: "教育学习", icon: "📚", slug: "education", count: 87 },
  { name: "数据分析", icon: "📈", slug: "data-analysis", count: 65 },
  { name: "生活助手", icon: "🏠", slug: "lifestyle", count: 112 }
];

// Mock prompts data
const mockPrompts = [
  {
    id: "1",
    title: "有效的会议总结助手",
    description: "帮助用户总结会议内容，提取关键点和行动项目",
    content: "我需要你充当会议总结助手...",
    category: "工作效率",
    is_public: false,  // Add this property
    author: { name: "张明", avatar: "" },
    stats: { rating: 4.9, comments: 23 }
  },
  // ... add more mock prompts
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrompts = useMemo(() => {
    return mockPrompts.filter(prompt => {
      const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            count={mockPrompts.length}
            isSelected={!selectedCategory}
            onClick={() => setSelectedCategory(null)}
          />
          {categories.map((category) => (
            <CategoryButton 
              key={category.slug}
              {...category}
              isSelected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </div>

        {/* Filtered Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} />
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
