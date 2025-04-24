
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PromptForm } from "@/components/prompts/PromptForm";
import { usePromptForm } from "@/hooks/usePromptForm";
import { toast } from "sonner";

export default function SubmitPrompt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { form, onSubmit, checkingAuth, setCheckingAuth, forkedPrompt } = usePromptForm();

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

  // 处理 fork 数据
  useEffect(() => {
    if (forkedPrompt.forkedFrom) {
      form.reset({
        title: forkedPrompt.title || "",
        description: forkedPrompt.description || "",
        category: forkedPrompt.category || "",
        tags: forkedPrompt.tags || "",
        content: forkedPrompt.content || "",
        example_output: forkedPrompt.exampleOutput || "",
        is_public: true,
        terms: false,
        forkedFrom: forkedPrompt.forkedFrom,
      });
    }
  }, [forkedPrompt, form]);

  // 如果正在加载认证状态或检查认证，显示加载提示
  if (isLoading || checkingAuth) {
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
          {forkedPrompt.forkedFrom ? "Fork 并修改提示词" : "提交新提示词"}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {forkedPrompt.forkedFrom 
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
