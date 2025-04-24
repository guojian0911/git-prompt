
import { Avatar } from "@/components/ui/avatar";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <img 
              src={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.name}`} 
              alt={comment.author.name} 
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{comment.createdAt}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
