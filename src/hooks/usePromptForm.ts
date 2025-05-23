
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// 创建一个可配置的表单验证schema生成函数
const createPromptFormSchema = (isEditing = false) => {
  return z.object({
    title: z.string().min(1, "标题不能为空").max(100, "标题不能超过100个字符"),
    description: z.string().min(1, "描述不能为空").max(500, "描述不能超过500个字符"),
    content: z.string().min(1, "提示词内容不能为空"),
    category: z.string().min(1, "请选择分类"),
    tags: z.string(),
    example_output: z.string().optional(),
    is_public: z.boolean().default(true),
    // 在编辑模式下放宽terms验证
    terms: isEditing
      ? z.boolean().optional().default(true)
      : z.boolean().refine((val) => val === true, {
          message: "您必须同意服务条款",
        }),
    forkedFrom: z.string().optional(),
  });
};

// 默认使用非编辑模式的schema
const promptFormSchema = createPromptFormSchema(false);

export type PromptFormValues = z.infer<typeof promptFormSchema>;

export const usePromptForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const forkedPrompt = location.state?.forkedPrompt || {};

  // 检查是否是编辑模式
  const urlParams = new URLSearchParams(location.search);
  const isEditMode = !!urlParams.get('edit');

  // 根据是否是编辑模式选择不同的验证schema
  const formSchema = createPromptFormSchema(isEditMode);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      content: "",
      example_output: "",
      is_public: false, // 默认为私有
      terms: isEditMode ? true : false, // 编辑模式下默认同意条款
      forkedFrom: "",
    },
    mode: "onChange", // 添加实时验证模式
  });

  // 移除调试日志，避免循环渲染

  const setEditMode = (promptId: string) => {
    setEditingPromptId(promptId);
  };

  const onSubmit = async (data: PromptFormValues) => {
    if (!user) {
      toast.error("请先登录后再提交提示词");
      navigate("/auth/login", { state: { returnUrl: location.pathname } });
      return;
    }

    setIsSubmitting(true);
    try {
      // 提交数据

      // 确保tags是数组
      const tagsArray = typeof data.tags === 'string'
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : Array.isArray(data.tags)
          ? data.tags
          : [];

      console.log('提交的原始标签数据:', data.tags); // 调试日志
      console.log('处理后的标签数据:', tagsArray); // 调试日志

      if (editingPromptId) {
        // 更新已有提示词
        const { error: updateError } = await supabase
          .from("prompts")
          .update({
            title: data.title,
            description: data.description,
            content: data.content,
            category: data.category,
            tags: tagsArray,
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
          tags: tagsArray,
          example_output: data.example_output || null,
          is_public: data.is_public,
          fork_from: data.forkedFrom || null,
        });

        if (insertError) throw insertError;

        // 如果是Fork操作，更新原始提示词的fork_count
        if (data.forkedFrom) {
          try {
            // 先获取当前的fork_count
            const { data: originalPrompt } = await supabase
              .from('prompts')
              .select('fork_count')
              .eq('id', data.forkedFrom)
              .single();

            if (originalPrompt) {
              // 更新fork_count
              await supabase
                .from('prompts')
                .update({ fork_count: (originalPrompt.fork_count || 0) + 1 })
                .eq('id', data.forkedFrom);
            }
          } catch (error) {
            console.error("Failed to update fork count:", error);
            // 不阻止主流程，即使更新fork_count失败
          }
        }

        toast.success("提示词提交成功！");
      }

      navigate("/profile");
    } catch (error: any) {
      console.error("Error submitting prompt:", error);
      toast.error(error.message || "提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置表单函数
  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      category: "",
      tags: "",
      content: "",
      example_output: "",
      is_public: false,
      terms: false,
      forkedFrom: "",
    });

    // 触发表单值变化事件，确保UI更新
    form.trigger();
  };

  return {
    form,
    onSubmit,
    checkingAuth,
    setCheckingAuth,
    forkedPrompt,
    setEditMode,
    editingPromptId,
    isSubmitting,
    resetForm,
  };
};
