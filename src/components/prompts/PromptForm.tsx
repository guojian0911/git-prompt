
import React from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/constants/categories";
import type { PromptFormValues } from "@/hooks/usePromptForm";
import type { UseFormReturn } from "react-hook-form";

interface PromptFormProps {
  form: UseFormReturn<PromptFormValues>;
  onSubmit: (data: PromptFormValues) => Promise<void>;
  isForking?: boolean;
}

export const PromptForm = ({
  form,
  onSubmit,
  isForking = false,
}: PromptFormProps) => {
  return (
    <Form {...form}>
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
            placeholder="用逗号分隔标签，例如：推理, 生产力, 编程"
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
          <label className="text-sm font-medium" htmlFor="example_output">示例输出（可选）</label>
          <Textarea
            id="example_output"
            className="min-h-[120px]"
            placeholder="提供一个由您的提示词生成的输出示例"
            {...form.register("example_output")}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_public"
              checked={form.watch("is_public")}
              onCheckedChange={(checked) => {
                form.setValue("is_public", checked === true, { shouldValidate: true });
              }}
            />
            <label htmlFor="is_public" className="text-sm font-medium">
              公开分享
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={form.watch("terms")}
              onCheckedChange={(checked) => {
                form.setValue("terms", checked === true, { shouldValidate: true });
              }}
            />
            <label htmlFor="terms" className="text-sm">
              我同意 <a href="/terms" className="text-primary hover:underline">服务条款</a> 和{" "}
              <a href="/privacy" className="text-primary hover:underline">隐私政策</a>
            </label>
          </div>
          {form.formState.errors.terms && (
            <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={!form.formState.isValid}
        >
          {isForking ? "提交修改后的提示词" : "提交提示词"}
        </Button>
      </form>
    </Form>
  );
};
