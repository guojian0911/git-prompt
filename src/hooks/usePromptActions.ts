
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export const usePromptActions = (promptId: string, initialStarCount: number = 0, initialIsPublic: boolean = false) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(initialStarCount);
  const [isSharing, setIsSharing] = useState(false);
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  // 检查用户是否已收藏该提示词
  useEffect(() => {
    const checkIfStarred = async () => {
      if (!user || !promptId) return;

      try {
        // 获取提示词信息
        const { data: promptData } = await supabase
          .from('prompts')
          .select('stars_count')
          .eq('id', promptId)
          .single();

        if (promptData) {
          setStarCount(promptData.stars_count || 0);

          // 这里我们假设stars_count > 0表示已收藏
          // 在实际应用中，你可能需要一个单独的表来跟踪用户的收藏状态
          setIsStarred(promptData.stars_count > 0);
        }
      } catch (error) {
        console.error('Error checking star status:', error);
      }
    };

    checkIfStarred();
  }, [user, promptId]);

  const handleShare = async (id: string, userId?: string) => {
    if (!id || !userId) return;

    setIsSharing(true);
    try {
      const { error } = await supabase
        .from('prompts')
        .update({ is_public: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      // 更新本地状态
      setIsPublic(true);

      // 更新React Query缓存
      // 1. 更新提示词列表缓存
      queryClient.setQueriesData({queryKey: ['prompts', userId]}, (oldData: unknown) => {
        if (!oldData) return oldData;
        // 检查oldData是否为数组
        if (Array.isArray(oldData)) {
          return oldData.map((prompt: Record<string, unknown>) =>
            prompt.id === id ? { ...prompt, is_public: true } : prompt
          );
        }
        // 如果不是数组，直接返回原数据
        return oldData;
      });

      // 2. 更新用户统计信息缓存
      queryClient.setQueriesData({queryKey: ['userStats', userId]}, (oldData: unknown) => {
        if (!oldData) return oldData;
        const typedData = oldData as Record<string, unknown>;
        const publicPrompts = typeof typedData.publicPrompts === 'number' ? typedData.publicPrompts + 1 : 1;
        const privatePrompts = typeof typedData.privatePrompts === 'number' ? Math.max(0, typedData.privatePrompts - 1) : 0;

        return {
          ...typedData,
          publicPrompts,
          privatePrompts
        };
      });

      // 3. 使相关查询失效，确保数据最终一致
      setTimeout(() => {
        queryClient.invalidateQueries({queryKey: ['prompts']});
        queryClient.invalidateQueries({queryKey: ['userStats']});
      }, 1000);

      toast.success("提示词已成功公开分享！");
    } catch (error: unknown) {
      console.error('Error sharing prompt:', error);
      toast.error("分享失败，请重试");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("提示词已复制到剪贴板");
  };

  const handleToggleStar = async () => {
    if (!user || !promptId) {
      toast.error("请先登录");
      return;
    }

    try {
      // 获取当前的stars_count
      const { data: promptData, error: fetchError } = await supabase
        .from('prompts')
        .select('stars_count')
        .eq('id', promptId)
        .single();

      if (fetchError) throw fetchError;

      const currentStarCount = promptData?.stars_count || 0;
      const newStarCount = isStarred ? Math.max(0, currentStarCount - 1) : currentStarCount + 1;

      // 更新stars_count
      const { error: updateError } = await supabase
        .from('prompts')
        .update({ stars_count: newStarCount })
        .eq('id', promptId);

      if (updateError) throw updateError;

      // 更新本地状态
      setStarCount(newStarCount);
      setIsStarred(!isStarred);

      toast.success(isStarred ? "已取消收藏" : "已添加到收藏");
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error("操作失败，请重试");
    }
  };

  return {
    isStarred,
    starCount,
    handleShare,
    handleCopy,
    handleToggleStar,
    isSharing,
    isPublic,
  };
};
