
import { Copy, Edit, Share2, GitFork, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface PromptActionsProps {
  onCopy: (e: React.MouseEvent) => void;
  onShare?: () => void;
  onFork?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  showShare?: boolean;
  showEdit?: boolean;
  showFork?: boolean;
  showDelete?: boolean;
  isSharing?: boolean;
  isDeleting?: boolean;
  editState?: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    is_public: boolean;
    forkedFrom?: string | null;
  };
}

export const PromptActions = ({
  onCopy,
  onShare,
  onFork,
  onDelete,
  showShare,
  showEdit,
  showFork,
  showDelete,
  isSharing = false,
  isDeleting = false,
  editState
}: PromptActionsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onCopy}
        className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Copy className="w-4 h-4" />
      </button>

      {showFork && onFork && (
        <button
          onClick={onFork}
          className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <GitFork className="w-4 h-4" />
        </button>
      )}

      {showShare && (
        <button
          onClick={onShare}
          disabled={isSharing}
          className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </button>
      )}

      {showEdit && editState && (
        <Link
          to={`/submit?edit=${editState.id}`}
          state={{ editPrompt: editState }}
          className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Edit className="w-4 h-4" />
        </Link>
      )}

      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-slate-500 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="删除提示词"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

