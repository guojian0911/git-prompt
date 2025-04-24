
import { Copy, Edit, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

interface PromptActionsProps {
  onCopy: (e: React.MouseEvent) => void;
  onShare?: () => void;
  showShare?: boolean;
  showEdit?: boolean;
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
  showShare,
  showEdit,
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
      
      {showShare && (
        <button
          onClick={onShare}
          className="p-2 text-slate-500 hover:text-shumer-purple transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Share2 className="w-4 h-4" />
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
    </div>
  );
};
