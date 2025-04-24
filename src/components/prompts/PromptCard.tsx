import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePromptActions } from "@/hooks/usePromptActions";
import { PromptBadges } from "./PromptBadges";
import { PromptActions } from "./PromptActions";
import { PromptStats } from "./PromptStats";
import { Button } from "@/components/ui/button";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  is_public: boolean;
  user_id?: string;
  fork_from?: string | null;
  author: {
    name: string;
    avatar?: string;
  };
  stats: {
    rating: number;
    comments: number;
    stars?: number;
    forks?: number;
  };
  tags?: string[];
  onFork?: () => void;
}

const PromptCard = ({
  id,
  title,
  description,
  content,
  category,
  is_public,
  author,
  stats,
  user_id,
  fork_from,
  tags = [],
  onFork
}: PromptCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { isStarred, starCount, handleShare, handleCopy, handleToggleStar } = usePromptActions(stats.stars);
  
  const isPersonalPage = location.pathname === '/profile';
  const isHomePage = location.pathname === '/';
  const isOwner = user?.id === user_id;
  const isForkPrompt = !!fork_from;

  const handleCopyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCopy(content);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleStar();
  };

  const handleForkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFork) onFork();
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-0 p-4">
        <div className="flex justify-between items-start">
          <PromptBadges
            category={category}
            isPrivate={!is_public}
            isForkPrompt={isForkPrompt}
            isPersonalPage={isPersonalPage}
          />
          <PromptActions
            onCopy={handleCopyClick}
            onShare={() => handleShare(id, user?.id)}
            onFork={isHomePage && onFork ? handleForkClick : undefined}
            showShare={isPersonalPage && !is_public}
            showEdit={isPersonalPage}
            showFork={isHomePage && !!onFork}
            editState={isPersonalPage ? {
              id,
              title,
              description,
              content,
              category,
              tags: Array.isArray(tags) ? tags : [],
              is_public,
              forkedFrom: fork_from
            } : undefined}
          />
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
              <div 
                key={tag}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full"
              >
                {tag}
              </div>
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
          <PromptStats
            promptId={id}
            starCount={starCount}
            commentCount={stats.comments}
            forkCount={stats.forks}
            isStarred={isStarred}
            onStarClick={handleStarClick}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PromptCard;
