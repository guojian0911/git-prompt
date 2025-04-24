
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Copy, Edit, Star, MessageSquare, GitFork } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  is_public: boolean;
  user_id?: string;
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
  tags?: string[];
}

const PromptCard = ({
  id,
  title,
  description,
  content,
  category,
  author,
  stats,
  user_id,
  tags = []
}: PromptCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(stats.stars || 0);
  const location = useLocation();
  const { user } = useAuth();
  
  const isPersonalPage = location.pathname === '/profile';
  const isOwner = user?.id === user_id;
  const showForkButton = !isPersonalPage;
  const showEditButton = isPersonalPage && isOwner;

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
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-0 p-4">
        <div className="flex justify-between items-start">
          <Link
            to={`/category/${category.toLowerCase()}`}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {category}
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Copy className="w-4 h-4" />
            </button>
            {showEditButton && (
              <Link
                to={`/submit?edit=${id}`}
                className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit className="w-4 h-4" />
              </Link>
            )}
            {showForkButton && (
              <Link
                to={`/prompt/${id}`}
                className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <GitFork className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <Link to={`/prompt/${id}`} className="block">
          <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100 group-hover:text-shumer-purple transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4">
            {description}
          </p>
        </Link>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
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
      </CardContent>

      <CardFooter className="p-4 flex flex-col gap-4">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center w-full">
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
              <span className="text-sm">{starCount}</span>
            </button>
            <Link 
              to={`/prompt/${id}`} 
              className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{stats.comments}</span>
            </Link>
            {showForkButton && (
              <div className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                <span className="text-sm">{stats.forks || 0}</span>
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PromptCard;
