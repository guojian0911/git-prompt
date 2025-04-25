
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PromptForm } from "@/components/prompts/PromptForm";
import { usePromptForm } from "@/hooks/usePromptForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SubmitPrompt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { form, onSubmit, checkingAuth, setCheckingAuth, forkedPrompt, setEditMode, isSubmitting, resetForm } = usePromptForm();
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

  // 检查URL参数是否包含edit或fork
  const urlParams = new URLSearchParams(location.search);
  const editId = urlParams.get('edit');
  const forkId = urlParams.get('fork');
  const isEditMode = !!editId;
  const isForkMode = !!forkId;

  // 获取传递的编辑数据或fork数据
  const editPromptData = location.state?.editPrompt || {};
  const forkPromptData = location.state?.forkedPrompt || {};

  // 检查用户是否登录
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("请先登录后再提交提示词");
        navigate("/auth/login", { state: { returnUrl: location.pathname } });
      }
      setCheckingAuth(false);
    }
  }, [user, isLoading, navigate, location.pathname, setCheckingAuth]);

  // 如果通过URL参数传递了editId或forkId但没有state数据，从数据库获取提示词数据
  useEffect(() => {
    // 如果已经有数据或者正在加载，则不需要再次获取
    if (isLoadingPrompt) return;

    const fetchPromptData = async () => {
      // 编辑模式 - 获取用户自己的提示词
      if (isEditMode && (!editPromptData || Object.keys(editPromptData).length === 0) && editId && user) {
        setIsLoadingPrompt(true);
        try {
          const { data, error } = await supabase
            .from("prompts")
            .select("*")
            .eq("id", editId)
            .eq("user_id", user.id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            // 将数据格式化为表单所需格式
            const formattedData = {
              id: data.id,
              title: data.title || "",
              description: data.description || "",
              category: data.category || "",
              tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
              content: data.content || "",
              example_output: data.example_output || "",
              is_public: data.is_public === undefined ? true : data.is_public,
              forkedFrom: data.fork_from || null
            };

            // 重置表单
            form.reset({
              title: formattedData.title,
              description: formattedData.description,
              category: formattedData.category,
              tags: formattedData.tags,
              content: formattedData.content,
              example_output: formattedData.example_output,
              is_public: formattedData.is_public,
              terms: true, // 编辑模式下默认同意条款
              forkedFrom: formattedData.forkedFrom || "",
            });

            setEditMode(editId);
          }
        } catch (error) {
          console.error("获取提示词数据失败:", error);
          toast.error("获取提示词数据失败，请重试");
        } finally {
          setIsLoadingPrompt(false);
        }
      }

      // Fork模式 - 获取任何提示词
      else if (isForkMode && (!forkPromptData || Object.keys(forkPromptData).length === 0) && forkId) {
        setIsLoadingPrompt(true);
        try {
          const { data, error } = await supabase
            .from("prompts")
            .select("*")
            .eq("id", forkId)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            // 将数据格式化为表单所需格式
            const formattedData = {
              title: `Copy of ${data.title}` || "",
              description: data.description || "",
              category: data.category || "",
              tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "",
              content: data.content || "",
              example_output: data.example_output || "",
              is_public: false, // Fork默认为私有
              forkedFrom: data.id
            };

            // 重置表单
            form.reset({
              title: formattedData.title,
              description: formattedData.description,
              category: formattedData.category,
              tags: formattedData.tags,
              content: formattedData.content,
              example_output: formattedData.example_output,
              is_public: formattedData.is_public,
              terms: true, // Fork模式下默认同意条款
              forkedFrom: formattedData.forkedFrom || "",
            });

            // 移除在加载时更新fork计数的逻辑
            // Fork计数将在用户提交表单后更新

            toast.info("已创建提示词副本，您可以在此基础上修改后提交");
          }
        } catch (error) {
          console.error("获取提示词数据失败:", error);
          toast.error("获取提示词数据失败，请重试");
        } finally {
          setIsLoadingPrompt(false);
        }
      }
    };

    fetchPromptData();
  // 移除form和setEditMode依赖项，避免循环更新
  }, [isEditMode, isForkMode, editPromptData, forkPromptData, editId, forkId, user, isLoadingPrompt]);

  // 处理编辑模式数据（当通过state传递数据时）
  useEffect(() => {
    // 如果正在加载，则不需要再次设置表单
    if (isLoadingPrompt) return;

    if (isEditMode && editPromptData && Object.keys(editPromptData).length > 0) {
      // 使用setTimeout避免在渲染周期内更新状态
      setTimeout(() => {
        form.reset({
          title: editPromptData.title || "",
          description: editPromptData.description || "",
          category: editPromptData.category || "",
          tags: Array.isArray(editPromptData.tags) ? editPromptData.tags.join(",") : editPromptData.tags || "",
          content: editPromptData.content || "",
          example_output: editPromptData.example_output || "",
          is_public: editPromptData.is_public === undefined ? true : editPromptData.is_public,
          terms: true, // 编辑模式下默认同意条款
          forkedFrom: editPromptData.forkedFrom || "",
        });

        if (editId) {
          setEditMode(editId);
        }
      }, 0);
    }
  // 移除form和setEditMode依赖项，避免循环更新
  }, [isEditMode, editPromptData, editId, isLoadingPrompt]);

  // 处理 fork 数据
  useEffect(() => {
    // 如果正在加载，则不需要再次设置表单
    if (isLoadingPrompt) return;

    if (!isEditMode && forkedPrompt.forkedFrom) {
      // 使用setTimeout避免在渲染周期内更新状态
      setTimeout(() => {
        form.reset({
          title: forkedPrompt.title || "",
          description: forkedPrompt.description || "",
          category: forkedPrompt.category || "",
          tags: Array.isArray(forkedPrompt.tags) ? forkedPrompt.tags.join(",") : forkedPrompt.tags || "",
          content: forkedPrompt.content || "",
          example_output: forkedPrompt.exampleOutput || "",
          is_public: false, // Fork默认为私有
          terms: true, // 设置为true以确保表单验证通过
          forkedFrom: forkedPrompt.forkedFrom,
        });
      }, 0);
    }
  // 移除form依赖项，避免循环更新
  }, [isEditMode, forkedPrompt, isLoadingPrompt]);

  // 如果正在加载认证状态、检查认证或加载提示词数据，显示加载提示
  if (isLoading || checkingAuth || isLoadingPrompt) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-lg">加载中...</span>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {isEditMode ? "编辑提示词" : forkedPrompt.forkedFrom ? "Fork 并修改提示词" : "提交新提示词"}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {isEditMode
            ? "您正在编辑自己的提示词。修改后点击提交更新。"
            : forkedPrompt.forkedFrom
              ? "您正在基于一个已有提示词创建新版本。请修改并提升它，然后分享给社区。"
              : "与社区分享您的AI提示词。好的提示词应当明确、具体并为AI模型提供足够的上下文信息。"
          }
        </p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <PromptForm
          form={form}
          onSubmit={onSubmit}
          isForking={Boolean(forkedPrompt.forkedFrom)}
          isEditing={isEditMode}
          isSubmitting={isSubmitting}
          resetForm={resetForm}
        />
      </div>

      <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/30">
        <div className="flex gap-2">
          <div className="flex-shrink-0 pt-0.5 text-purple-600 dark:text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">优质提示词的技巧</h3>
            <ul className="mt-2 text-sm text-purple-700 dark:text-purple-200/80 list-disc pl-5 space-y-1">
              <li>明确指定您希望AI执行的任务</li>
              <li>提供背景信息和上下文</li>
              <li>使用清晰、简洁的语言</li>
              <li>如果有帮助，可以包含示例</li>
              <li>指定您希望回应的格式</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
