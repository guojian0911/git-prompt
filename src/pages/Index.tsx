
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedPrompts from "@/components/home/FeaturedPrompts";

const Index = () => {
  const { isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedPrompts />
        
        {/* How It Works Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">如何使用ShumerPrompt</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              通过以下简单步骤，开始您的AI提示词之旅
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: "🔍",
                title: "发现提示词",
                description: "浏览我们的提示词库，搜索或按类别查找适合您需求的提示词"
              },
              {
                icon: "✨",
                title: "使用提示词",
                description: "复制提示词并将其粘贴到您喜欢的AI工具中，如ChatGPT、GPT-4等"
              },
              {
                icon: "🚀",
                title: "分享提示词",
                description: "创建并分享您自己的提示词，帮助社区成长并从他人的反馈中学习"
              }
            ].map((step, index) => (
              <div key={index} className="text-center glass-card p-6 rounded-xl">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">订阅我们的通讯</h2>
              <p className="text-white/80 mb-6">
                获取每周精选提示词推荐和最新的提示工程技巧
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="您的电子邮箱" 
                  className="px-4 py-3 flex-grow rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-shumer-purple font-medium px-6 py-3 rounded-lg hover:bg-white/90 transition-all">
                  订阅
                </button>
              </div>
              <p className="mt-4 text-xs text-white/60">
                我们尊重您的隐私，您可以随时取消订阅
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
