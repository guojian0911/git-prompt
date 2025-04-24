
import { Star, MessageSquare, GitFork } from "lucide-react";
import { Link } from "react-router-dom";

interface PromptStatsProps {
  promptId: string;
  starCount: number;
  commentCount: number;
  forkCount?: number;
  isStarred: boolean;
  onStarClick: (e: React.MouseEvent) => void;
}

export const PromptStats = ({
  promptId,
  starCount,
  commentCount,
  forkCount = 0,
  isStarred,
  onStarClick
}: PromptStatsProps) => {
  return (
    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
      <button 
        onClick={onStarClick}
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
        to={`/prompt/${promptId}`} 
        className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm">{commentCount}</span>
      </Link>
      <div className="flex items-center gap-1.5">
        <GitFork className="w-4 h-4" />
        <span className="text-sm">{forkCount}</span>
      </div>
    </div>
  );
};

