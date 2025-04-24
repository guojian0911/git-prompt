
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const usePromptActions = (initialStarCount: number = 0) => {
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(initialStarCount);

  const handleShare = async (id: string, userId?: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .update({ is_public: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      toast.success("提示词已成功公开分享！");
    } catch (error: any) {
      console.error('Error sharing prompt:', error);
      toast.error("分享失败，请重试");
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("提示词已复制到剪贴板");
  };

  const handleToggleStar = () => {
    if (isStarred) {
      setStarCount(prev => prev - 1);
      toast.success("已取消收藏");
    } else {
      setStarCount(prev => prev + 1);
      toast.success("已添加到收藏");
    }
    setIsStarred(!isStarred);
  };

  return {
    isStarred,
    starCount,
    handleShare,
    handleCopy,
    handleToggleStar,
  };
};
