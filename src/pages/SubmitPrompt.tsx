
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
];

export default function SubmitPrompt() {
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
    },
  });

  const onSubmit = async (data: PromptFormValues) => {
    try {
      // 这里先模拟提交，后续会替换为实际的 API 调用
      console.log("Form data:", data);
      toast.success("Your prompt has been submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit prompt. Please try again.");
    }
  };

  return (
    <div className="container py-12 max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit a Prompt</h1>
        <p className="text-muted-foreground max-w-2xl">
          Share your AI prompt with the community. Great prompts are clear, specific, and provide context for the AI model.
        </p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">Title</label>
            <Input
              id="title"
              placeholder="E.g., Expert Reasoning Guide"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">Description</label>
            <Textarea
              id="description"
              placeholder="Briefly describe what your prompt does and how it helps users"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="category">Category</label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("category")}
            >
              <option value="">Select category</option>
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
            <label className="text-sm font-medium" htmlFor="tags">Tags</label>
            <Input
              id="tags"
              placeholder="E.g., reasoning, productivity, programming"
              {...form.register("tags")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">Prompt Content</label>
            <Textarea
              id="content"
              className="min-h-[200px] font-mono"
              placeholder="Paste your prompt content here..."
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="exampleOutput">Example Output (Optional)</label>
            <Textarea
              id="exampleOutput"
              className="min-h-[120px]"
              placeholder="Provide an example of the output generated by your prompt"
              {...form.register("exampleOutput")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" {...form.register("terms")} />
              <label htmlFor="terms" className="text-sm">
                I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
            {form.formState.errors.terms && (
              <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">Submit Prompt</Button>
        </form>
      </div>

      <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/30">
        <div className="flex gap-2">
          <div className="flex-shrink-0 pt-0.5 text-purple-600 dark:text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Tips for great prompts</h3>
            <ul className="mt-2 text-sm text-purple-700 dark:text-purple-200/80 list-disc pl-5 space-y-1">
              <li>Be specific about what you want the AI to do</li>
              <li>Provide context and background information</li>
              <li>Use clear, concise language</li>
              <li>Include examples if helpful</li>
              <li>Specify the format you want the response in</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
