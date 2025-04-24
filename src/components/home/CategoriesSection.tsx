
import { Link } from "react-router-dom";
import CategoryButton from "../ui/CategoryButton";

const categories = [
  { name: "工作效率", icon: "📊", slug: "productivity", count: 124 },
  { name: "创意写作", icon: "✍️", slug: "creative-writing", count: 98 },
  { name: "编程开发", icon: "💻", slug: "programming", count: 156 },
  { name: "教育学习", icon: "📚", slug: "education", count: 87 },
  { name: "数据分析", icon: "📈", slug: "data-analysis", count: 65 },
  { name: "生活助手", icon: "🏠", slug: "lifestyle", count: 112 }
];

export const CategoriesSection = () => {
  return (
    <>
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
    </>
  );
};
