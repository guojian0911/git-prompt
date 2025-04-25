import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PromptState } from "@/constants/promptStates";

export const usePromptDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (promptId: string, userId: string) => {
    if (!promptId || !userId) {
      toast.error("无法删除提示词，请重试");
      return;
    }

    setIsDeleting(true);
    try {
      // 逻辑删除提示词，将状态设置为已删除
      const { error } = await supabase
        .from('prompts')
        .update({ state: PromptState.DELETED })
        .eq('id', promptId)
        .eq('user_id', userId);

      if (error) throw error;

      // 更新缓存
      queryClient.invalidateQueries({queryKey: ['prompts']});
      
      toast.success("提示词已删除");
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error("删除失败，请重试");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDelete
  };
};
