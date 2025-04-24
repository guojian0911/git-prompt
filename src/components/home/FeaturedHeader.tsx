
interface FeaturedHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const FeaturedHeader = ({ activeTab, onTabChange }: FeaturedHeaderProps) => {
  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4">探索提示词</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          发现社区创建的高质量提示词，提升您与AI的交互体验
        </p>
      </div>

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
              onClick={() => onTabChange(tab)}
            >
              {tab === "featured" ? "精选" : tab === "recent" ? "最新" : "热门"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
