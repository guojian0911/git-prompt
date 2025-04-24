
import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Star, MessageSquare } from "lucide-react";
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

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("提示词已复制到剪贴板");
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
          <div className="flex items-center">
            <Star className="w-4 h-4 text-amber-400 mr-1" />
            <span className="text-sm">{stats.rating}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span className="text-sm">{stats.comments}</span>
          </div>
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
        <Button
          variant="outline"
          size="sm"
          className="text-shumer-purple border-shumer-purple/30 hover:bg-shumer-purple/10"
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4 mr-2" />
          复制
        </Button>
      </div>
    </div>
  );
};

export default PromptCard;
