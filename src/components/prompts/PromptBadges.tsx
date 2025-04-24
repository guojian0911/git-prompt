
import { GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface PromptBadgesProps {
  category: string;
  isPrivate?: boolean;
  isForkPrompt?: boolean;
  isPersonalPage?: boolean;
}

export const PromptBadges = ({ 
  category,
  isPrivate,
  isForkPrompt,
  isPersonalPage
}: PromptBadgesProps) => {
  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/category/${category.toLowerCase()}`}
        className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        {category}
      </Link>
      {isPrivate && isPersonalPage && (
        <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
          Private
        </Badge>
      )}
      {isForkPrompt && (
        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
          <GitFork className="w-3 h-3 mr-1" />
          Fork
        </Badge>
      )}
    </div>
  );
};
