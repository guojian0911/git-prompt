
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const promptFormSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题不能超过100个字符"),
  description: z.string().min(1, "描述不能为空").max(500, "描述不能超过500个字符"),
  content: z.string().min(1, "提示词内容不能为空"),
  category: z.string().min(1, "请选择分类"),
  tags: z.string(),
  example_output: z.string().optional(),
  is_public: z.boolean().default(true),
  terms: z.boolean().refine((val) => val === true, {
    message: "您必须同意服务条款",
  }),
  forkedFrom: z.string().optional(),
});

export type PromptFormValues = z.infer<typeof promptFormSchema>;

export const usePromptForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const forkedPrompt = location.state || {};

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      content: "",
      example_output: "",
      is_public: true,
      terms: false,
      forkedFrom: "",
    },
    mode: "onChange", // 添加实时验证模式
  });

  const setEditMode = (promptId: string) => {
    setEditingPromptId(promptId);
  };

  const onSubmit = async (data: PromptFormValues) => {
    if (!user) {
      toast.error("请先登录后再提交提示词");
      navigate("/auth/login", { state: { returnUrl: location.pathname } });
      return;
    }

    try {
      console.log("提交的数据:", data); // 添加日志查看提交的数据

      if (editingPromptId) {
        // 更新已有提示词
        const { error: updateError } = await supabase
          .from("prompts")
          .update({
            title: data.title,
            description: data.description,
            content: data.content,
            category: data.category,
            tags: data.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            example_output: data.example_output || null,
            is_public: data.is_public,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPromptId)
          .eq("user_id", user.id); // 确保只能编辑自己的提示词

        if (updateError) throw updateError;

        toast.success("提示词更新成功！");
      } else {
        // 创建新提示词
        const { error: insertError } = await supabase.from("prompts").insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          content: data.content,
          category: data.category,
          tags: data.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
          example_output: data.example_output || null,
          is_public: data.is_public,
          fork_from: data.forkedFrom || null,
        });

        if (insertError) throw insertError;

        toast.success("提示词提交成功！");
      }
      
      navigate("/profile");
    } catch (error: any) {
      console.error("Error submitting prompt:", error);
      toast.error(error.message || "提交失败，请重试");
    }
  };

  return {
    form,
    onSubmit,
    checkingAuth,
    setCheckingAuth,
    forkedPrompt,
    setEditMode,
    editingPromptId,
  };
};
