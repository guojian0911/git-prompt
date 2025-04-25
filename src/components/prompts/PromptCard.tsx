
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePromptActions } from "@/hooks/usePromptActions";
import { usePromptDelete } from "@/hooks/usePromptDelete";
import { PromptBadges } from "./PromptBadges";
import { PromptActions } from "./PromptActions";
import { PromptStats } from "./PromptStats";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  // onFork 属性已移除，因为Fork功能仅在详情页面可用
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
  user_id: _user_id, // 使用下划线前缀表示未使用的变量
  fork_from,
  tags = []
  // onFork 参数已移除，因为Fork功能仅在详情页面可用
}: PromptCardProps) => {
  // 状态管理
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { isStarred, starCount, handleShare, handleCopy, handleToggleStar, isSharing, isPublic } = usePromptActions(id, stats.stars, is_public);
  const { isDeleting, handleDelete } = usePromptDelete();

  const isPersonalPage = location.pathname === '/profile';
  // const isHomePage = location.pathname === '/';
  const isOwner = user?.id === _user_id; // 检查是否是提示词的所有者
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

  // 处理删除按钮点击
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (user?.id) {
      handleDelete(id, user.id);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className={`group bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl hover:shadow-lg transition-all duration-300 ${isSharing ? 'opacity-70' : ''}`}>
        {isSharing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 z-10 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}
        <CardHeader className="space-y-0 p-4">
          <div className="flex justify-between items-start gap-4">
            <PromptBadges
              category={category}
              isPrivate={!isPublic}
              isForkPrompt={isForkPrompt}
              isPersonalPage={isPersonalPage}
            />
            <PromptActions
              onCopy={handleCopyClick}
              onShare={() => handleShare(id, user?.id)}
              onFork={undefined}
              onDelete={handleDeleteClick}
              showShare={isPersonalPage && !isPublic}
              showEdit={isPersonalPage && !isPublic}
              showFork={false}
              showDelete={isPersonalPage && !isPublic && isOwner}
              isSharing={isSharing}
              isDeleting={isDeleting}
              editState={isPersonalPage ? {
                id,
                title,
                description,
                content,
                category,
                tags: Array.isArray(tags) ? tags : [],
                is_public: isPublic,
                forkedFrom: fork_from
              } : undefined}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <Link to={`/prompt/${id}`} className="block">
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
              {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-1 mb-4">
              {description}
            </p>
          </Link>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100/50 dark:border-slate-800/50">
            <pre className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap line-clamp-1">
              {content}
            </pre>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="text-xs bg-purple-100/50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 flex flex-col gap-4 border-t border-slate-100/50 dark:border-slate-800/50 mt-2">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <img
                src={author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author.name || 'user'}`}
                alt={author.name}
                className="w-8 h-8 rounded-full ring-2 ring-white/50 dark:ring-slate-800/50"
                onError={(e) => {
                  // 如果图片加载失败，使用纯色背景和文字作为备用
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // 防止无限循环
                  target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23764abc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='35' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${(author.name?.[0] || 'U').toUpperCase()}%3C/text%3E%3C/svg%3E`;
                }}
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

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除提示词 "{title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PromptCard;
