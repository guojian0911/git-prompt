
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

const promptFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string(),
  content: z.string().min(1, "Prompt content is required"),
  exampleOutput: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  forkedFrom: z.string().optional(),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;

const categories = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "writing", label: "Writing" },
  { value: "coding", label: "Coding" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "marketing", label: "Marketing" },
  { value: "creative", label: "Creative" },
  { value: "productivity", label: "Productivity" },
  { value: "research", label: "Research" },
  { value: "产品经理", label: "产品经理" },
];

export default function SubmitPrompt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const forkedPrompt = location.state || {};
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      content: "",
      exampleOutput: "",
      terms: false,
      forkedFrom: "",
    },
  });

  // 检查用户是否登录
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("请先登录后再提交提示词");
        navigate("/auth/login", { state: { returnUrl: location.pathname } });
      }
      setCheckingAuth(false);
    }
  }, [user, isLoading, navigate, location.pathname]);

  // Handle fork data if available
  useEffect(() => {
    if (forkedPrompt.forkedFrom) {
      form.reset({
        title: forkedPrompt.title || "",
        description: forkedPrompt.description || "",
        category: forkedPrompt.category || "",
        tags: forkedPrompt.tags || "",
        content: forkedPrompt.content || "",
        exampleOutput: forkedPrompt.exampleOutput || "",
        terms: false,
        forkedFrom: forkedPrompt.forkedFrom,
      });

      toast.info("您正在基于一个已有提示词创建新提示词");
    }
  }, [forkedPrompt, form]);

  const onSubmit = async (data: PromptFormValues) => {
    if (!user) {
      toast.error("请先登录后再提交提示词");
      navigate("/auth/login", { state: { returnUrl: location.pathname } });
      return;
    }

    try {
      // 这里先模拟提交，后续会替换为实际的 API 调用
      console.log("Form data:", data);
      toast.success("Your prompt has been submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit prompt. Please try again.");
    }
  };

  // 如果正在加载认证状态或检查认证，显示简单的加载提示
  if (isLoading || checkingAuth) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-lg">加载中...</span>
      </div>
    );
  }

  // 如果没有用户，重定向已经在useEffect中处理
  if (!user) return null;

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">标题</label>
            <Input
              id="title"
              placeholder="例如：专家推理指南"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">描述</label>
            <Textarea
              id="description"
              placeholder="简要描述您的提示词的功能和它如何帮助用户"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="category">分类</label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("category")}
            >
              <option value="">选择分类</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {form.formState.errors.category && (
              <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="tags">标签</label>
            <Input
              id="tags"
              placeholder="例如：推理, 生产力, 编程"
              {...form.register("tags")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">提示词内容</label>
            <Textarea
              id="content"
              className="min-h-[200px] font-mono"
              placeholder="在此粘贴您的提示词内容..."
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="exampleOutput">示例输出（可选）</label>
            <Textarea
              id="exampleOutput"
              className="min-h-[120px]"
              placeholder="提供一个由您的提示词生成的输出示例"
              {...form.register("exampleOutput")}
            />
          </div>

          {forkedPrompt.forkedFrom && (
            <input 
              type="hidden" 
              {...form.register("forkedFrom")} 
              value={forkedPrompt.forkedFrom} 
            />
          )}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" {...form.register("terms")} />
              <label htmlFor="terms" className="text-sm">
                我同意 <a href="/terms" className="text-primary hover:underline">服务条款</a> 和{" "}
                <a href="/privacy" className="text-primary hover:underline">隐私政策</a>
              </label>
            </div>
            {form.formState.errors.terms && (
              <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {forkedPrompt.forkedFrom ? "提交修改后的提示词" : "提交提示词"}
          </Button>
        </form>
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
};
