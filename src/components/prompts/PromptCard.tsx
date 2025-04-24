import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Star, MessageSquare, GitFork } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SharePromptDialog } from "./SharePromptDialog";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  is_public: boolean;
  author: {
    name: string;
    avatar?: string;
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
  is_public,
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
    <div className="prompt-card animate-slide-up hover:scale-[1.02] transition-all duration-300">
      <div className="flex justify-between items-start gap-4 mb-4">
        <Link
          to={`/category/${category.toLowerCase()}`}
          className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {category}
        </Link>
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
          <button 
            onClick={handleToggleStar}
            className="flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {isStarred ? (
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Star className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{starCount}</span>
          </button>
          <Link to={`/prompt/${id}`} className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{stats.comments}</span>
          </Link>
        </div>
      </div>

      <Link to={`/prompt/${id}`} className="block mb-4">
        <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100 hover:text-shumer-purple transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
          {description}
        </p>
      </Link>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-4">
        <pre className={`text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-3'}`}>
          {content}
        </pre>
        {content.length > 150 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-shumer-purple text-xs mt-2 hover:underline font-medium"
          >
            {isExpanded ? '收起' : '展开全部'}
          </button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`}
            alt={author.name}
            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-800"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {author.name}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-shumer-purple border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4 mr-1.5" />
            复制
          </Button>
          {!is_public && <SharePromptDialog promptId={id} promptTitle={title} />}
          <Link to={`/prompt/${id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-shumer-purple border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <GitFork className="w-4 h-4 mr-1.5" />
              Fork
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
