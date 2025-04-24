
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-shumer-purple/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-shumer-blue/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="gradient-text">发现、创建与分享</span>
          <br />
          <span className="text-slate-800 dark:text-white">AI提示词的中心平台</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
          探索高质量的AI提示词，提升您与人工智能交互的效率，释放AI的全部潜能
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="搜索提示词、类别或关键词..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-shumer-purple/50 transition-all shadow-lg"
          />
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button className="btn-primary h-12 px-8 text-base">浏览提示词</Button>
          <Button variant="outline" className="btn-outline h-12 px-8 text-base">创建提示词</Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "1,000+", label: "提示词" },
            { value: "50+", label: "类别" },
            { value: "5,000+", label: "用户" },
            { value: "20,000+", label: "已使用次数" }
          ].map((stat, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
