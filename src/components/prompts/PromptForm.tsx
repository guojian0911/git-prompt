
import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { categories } from "@/constants/categories";
import type { PromptFormValues } from "@/hooks/usePromptForm";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Loader2, X } from "lucide-react";

interface PromptFormProps {
  form: UseFormReturn<PromptFormValues>;
  onSubmit: (data: PromptFormValues) => Promise<void>;
  isForking?: boolean;
  isEditing?: boolean;
  isSubmitting?: boolean;
  resetForm?: () => void;
}

export const PromptForm = ({
  form,
  onSubmit,
  isForking = false,
  isEditing = false,
  isSubmitting = false,
  resetForm,
}: PromptFormProps) => {
  // 状态管理
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<PromptFormValues | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // 监听表单值变化，更新标签
  useEffect(() => {
    // 初始加载标签
    const initialTagsString = form.getValues("tags");
    if (initialTagsString) {
      const tagArray = initialTagsString.split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
      setTags(tagArray);
    }

    // 监听表单值变化
    const subscription = form.watch((value, { name }) => {
      if (name === 'tags' || name === undefined) {
        const tagsString = value.tags as string;
        if (tagsString) {
          const tagArray = tagsString.split(",")
            .map(tag => tag.trim())
            .filter(tag => tag);
          setTags(tagArray);
        } else {
          // 如果tagsString为空，确保tags也为空
          setTags([]);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // 注意：标签输入和删除的处理逻辑已移至Controller组件内部

  // 处理表单提交
  const handleSubmit = (data: PromptFormValues) => {
    if ((isEditing || isForking) && !isSubmitting) {
      setFormData(data);
      setShowConfirmDialog(true);
    } else {
      onSubmit(data);
    }
  };

  const confirmSubmit = () => {
    // 使用最新的表单数据，而不是之前存储的formData
    const currentData = form.getValues();
    // 添加调试日志
    console.log('提交前的表单数据:', currentData);
    console.log('提交前的标签值:', currentData.tags);
    onSubmit(currentData);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="title">标题</label>
            <span className={`text-xs ${form.watch('title').length > 80 ? 'text-amber-500' : 'text-gray-500'}`}>
              {form.watch('title').length}/100
            </span>
          </div>
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
                disabled={isSubmitting}
                className={form.formState.errors.title ? "border-red-300 focus-visible:ring-red-200" :
                  field.value && field.value.length > 0 ? "border-green-300 focus-visible:ring-green-200" : ""}
              />
            )}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="description">描述</label>
            <span className={`text-xs ${form.watch('description').length > 400 ? 'text-amber-500' : 'text-gray-500'}`}>
              {form.watch('description').length}/500
            </span>
          </div>
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
                disabled={isSubmitting}
                className={form.formState.errors.description ? "border-red-300 focus-visible:ring-red-200" :
                  field.value && field.value.length > 0 ? "border-green-300 focus-visible:ring-green-200" : ""}
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
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  form.formState.errors.category ? "border-red-300 focus-visible:ring-red-200" :
                  field.value ? "border-green-300 focus-visible:ring-green-200" : ""
                }`}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
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
              <>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => {
                          const newTags = tags.filter(t => t !== tag);
                          setTags(newTags);
                          // 使用form.setValue代替field.onChange，并确保触发表单验证
                          form.setValue('tags', newTags.join(','), { shouldValidate: true });
                        }}
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tagInput"
                  placeholder="输入标签后按Enter或逗号添加"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                      e.preventDefault();
                      const newTag = tagInput.trim();
                      if (!tags.includes(newTag)) {
                        const newTags = [...tags, newTag];
                        setTags(newTags);
                        // 使用form.setValue代替field.onChange，并确保触发表单验证
                        form.setValue('tags', newTags.join(','), { shouldValidate: true });
                        // 添加调试日志
                        console.log('添加标签后的表单值:', form.getValues('tags'));
                      }
                      setTagInput("");
                    }
                  }}
                  disabled={isSubmitting}
                  className={tags.length > 0 ? "border-green-300 focus-visible:ring-green-200" : ""}
                />
                <p className="text-xs text-gray-500">提示：按Enter或逗号添加标签</p>
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="content">提示词内容</label>
            <span className="text-xs text-gray-500">
              {form.watch('content').length} 字符
            </span>
          </div>
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => (
              <Textarea
                id="content"
                className={`min-h-[200px] font-mono ${
                  form.formState.errors.content ? "border-red-300 focus-visible:ring-red-200" :
                  field.value && field.value.length > 0 ? "border-green-300 focus-visible:ring-green-200" : ""
                }`}
                placeholder="在此粘贴您的提示词内容..."
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
              />
            )}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="example_output">示例输出（可选）</label>
            <span className="text-xs text-gray-500">
              {form.watch('example_output')?.length || 0} 字符
            </span>
          </div>
          <Controller
            name="example_output"
            control={form.control}
            render={({ field }) => (
              <Textarea
                id="example_output"
                className={`min-h-[120px] ${
                  field.value && field.value.length > 0 ? "border-green-300 focus-visible:ring-green-200" : ""
                }`}
                placeholder="提供一个由您的提示词生成的输出示例"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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

        <div className="flex gap-4">
          {resetForm && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
              className="flex-1"
            >
              重置表单
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1"
            disabled={!form.formState.isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              isEditing
                ? "保存更新"
                : isForking
                  ? "提交修改后的提示词"
                  : "提交提示词"
            )}
          </Button>
        </div>

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

    {/* 确认对话框 */}
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认{isEditing ? '更新' : '提交'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "您确定要保存对此提示词的更改吗？"
              : isForking
                ? "您确定要提交这个修改后的提示词吗？这将创建一个新的提示词。"
                : "您确定要提交这个提示词吗？"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>取消</Button>
          <Button onClick={confirmSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              "确认"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
