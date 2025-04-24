

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/constants/categories";
import type { PromptFormValues } from "@/hooks/usePromptForm";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

interface PromptFormProps {
  form: UseFormReturn<PromptFormValues>;
  onSubmit: (data: PromptFormValues) => Promise<void>;
  isForking?: boolean;
  isEditing?: boolean;
}

export const PromptForm = ({
  form,
  onSubmit,
  isForking = false,
  isEditing = false,
}: PromptFormProps) => {
  // 移除调试日志，避免循环渲染
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">标题</label>
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <Input
                id="title"
                placeholder="例如：专家推理指南"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={false}
              />
            )}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">描述</label>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="简要描述您的提示词的功能和它如何帮助用户"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={false}
              />
            )}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="category">分类</label>
          <Controller
            name="category"
            control={form.control}
            render={({ field }) => (
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={false}
              >
                <option value="">选择分类</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            )}
          />
          {form.formState.errors.category && (
            <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="tags">标签</label>
          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <Input
                id="tags"
                placeholder="用逗号分隔标签，例如：推理, 生产力, 编程"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={false}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="content">提示词内容</label>
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => (
              <Textarea
                id="content"
                className="min-h-[200px] font-mono"
                placeholder="在此粘贴您的提示词内容..."
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={false}
              />
            )}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="example_output">示例输出（可选）</label>
          <Controller
            name="example_output"
            control={form.control}
            render={({ field }) => (
              <Textarea
                id="example_output"
                className="min-h-[120px]"
                placeholder="提供一个由您的提示词生成的输出示例"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={false}
              />
            )}
          />
        </div>

        {/* 移除公开分享选项，用户只能从个人主页分享 */}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Controller
              name="terms"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                />
              )}
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
          {isEditing
            ? "保存更新"
            : isForking
              ? "提交修改后的提示词"
              : "提交提示词"
          }
        </Button>

        {/* 显示表单验证错误提示 */}
        {!form.formState.isValid && form.formState.isDirty && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            <p className="font-medium mb-1">表单验证失败，请检查以下问题：</p>
            <ul className="list-disc pl-5">
              {form.formState.errors.title && <li>标题: {form.formState.errors.title.message}</li>}
              {form.formState.errors.description && <li>描述: {form.formState.errors.description.message}</li>}
              {form.formState.errors.category && <li>分类: {form.formState.errors.category.message}</li>}
              {form.formState.errors.content && <li>提示词内容: {form.formState.errors.content.message}</li>}
              {form.formState.errors.terms && <li>服务条款: {form.formState.errors.terms.message}</li>}
            </ul>
          </div>
        )}
      </form>
    </Form>
  );
};
