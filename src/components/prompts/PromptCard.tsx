import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Star, MessageSquare, GitFork, Share } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  stats: {
    rating: number;
    comments: number;
    stars?: number;
    forks?: number;
    shares?: number;
  };
}

const PromptCard = ({
  id,
  title,
  description,
  content,
  category,
  author,
  stats
}: PromptCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(stats.stars || 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    toast.success("提示词已复制到剪贴板");
  };

  const handleToggleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isStarred) {
      setStarCount(prev => prev - 1);
      toast.success("已取消收藏");
    } else {
      setStarCount(prev => prev + 1);
      toast.success("已添加到收藏");
    }
    setIsStarred(!isStarred);
  };

  return (
    <div className="prompt-card animate-slide-up hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <Link
          to={`/category/${category.toLowerCase()}`}
          className="px-3 py-1 text-xs font-medium rounded-full bg-shumer-light-purple text-shumer-purple hover:bg-shumer-purple hover:text-white transition-colors"
        >
          {category}
        </Link>
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <button 
            onClick={handleToggleStar}
            className="flex items-center hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {isStarred ? (
              <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
            ) : (
              <Star className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm">{starCount}</span>
          </button>
          <Link to={`/prompt/${id}`} className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span className="text-sm">{stats.comments}</span>
          </Link>
          <div className="flex items-center">
            <Share className="w-4 h-4 mr-1" />
            <span className="text-sm">{stats.shares || 0}</span>
          </div>
          {stats.forks !== undefined && (
            <div className="flex items-center">
              <GitFork className="w-4 h-4 mr-1" />
              <span className="text-sm">{stats.forks}</span>
            </div>
          )}
        </div>
      </div>

      <Link to={`/prompt/${id}`}>
        <h3 className="text-xl font-semibold mb-2 hover:text-shumer-purple transition-colors">
          {title}
        </h3>
      </Link>

      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-4">
        <pre className={`text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-3'}`}>
          {content}
        </pre>
        {content.length > 150 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-shumer-purple text-xs mt-2 hover:underline"
          >
            {isExpanded ? '收起' : '展开全部'}
          </button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src={author.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + author.name}
            alt={author.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {author.name}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-shumer-purple border-shumer-purple/30 hover:bg-shumer-purple/10"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4 mr-2" />
            复制
          </Button>
          <Link to={`/prompt/${id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-shumer-purple border-shumer-purple/30 hover:bg-shumer-purple/10"
            >
              <GitFork className="w-4 h-4 mr-2" />
              Fork
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
