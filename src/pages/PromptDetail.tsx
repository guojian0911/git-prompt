
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitFork,
  Copy,
  MessageSquare,
  Star,
  ArrowLeft,
  Variable,
  Cpu
} from "lucide-react";
import { toast } from "sonner";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/contexts/AuthContext"; // 暂时不需要用户信息
import PromptDerivationTree from "@/components/prompts/PromptDerivationTree";
import { usePromptActions } from "@/hooks/usePromptActions";
import { extractVariables, replaceVariables } from "@/lib/promptVariables";
import { highlightVariables } from "@/lib/highlightVariables";
import { highlightVariables as highlightVariablesString } from "@/lib/modelUtils";
import ModelCaller from "@/components/model/ModelCaller";

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth(); // 暂时不需要用户信息
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { isStarred, starCount, handleToggleStar } = usePromptActions(id || "", 0);

  // 变量相关状态
  const [promptVariables, setPromptVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [processedContent, setProcessedContent] = useState<string>("");

  // 处理变量值变化
  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  // Fetch prompt data from Supabase
  const { data: prompt, isLoading, error } = useQuery({
    queryKey: ['prompt', id],
    queryFn: async () => {
      if (!id) throw new Error('No prompt ID provided');

      // Get prompt data
      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single();

      if (promptError) throw promptError;
      if (!promptData) throw new Error('Prompt not found');

      // Get author information
      const { data: authorProfile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', promptData.user_id)
        .single();

      // Get comments count for this prompt (currently using mock data)
      const commentsCount = 2; // In a real app, you'd fetch this from a comments table

      return {
        ...promptData,
        author: {
          name: authorProfile?.username || 'Anonymous',
          avatar: authorProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorProfile?.username || 'anon'}`,
          bio: "User" // This could be fetched from an extended profile in the future
        },
        stats: {
          rating: 0, // Not implemented yet
          comments: commentsCount,
          forks: promptData.fork_count || 0,
          stars: promptData.stars_count || 0
        },
        tags: promptData.tags || []
      };
    }
  });

  // 提取变量 - 当提示词内容加载时
  useEffect(() => {
    if (prompt?.content) {
      // 提取变量
      const variables = extractVariables(prompt.content);
      setPromptVariables(variables);

      // 初始化变量值 - 全部设为空字符串
      const initialValues: Record<string, string> = {};
      variables.forEach(variable => {
        initialValues[variable] = "";
      });

      // 设置初始变量值
      setVariableValues(initialValues);

      // 初始时使用原始内容
      setProcessedContent(prompt.content);
    }
  }, [prompt?.content]);

  // 当变量值改变时更新处理后的内容
  useEffect(() => {
    if (prompt?.content && promptVariables.length > 0) {
      // 只有当有变量值被填写时才替换
      const hasFilledValues = Object.values(variableValues).some(value => value.trim() !== "");

      if (hasFilledValues) {
        const newContent = replaceVariables(prompt.content, variableValues);
        setProcessedContent(newContent);
      } else {
        // 如果没有填写任何变量，使用原始内容
        setProcessedContent(prompt.content);
      }
    }
  }, [prompt?.content, variableValues, promptVariables.length]);

  // 不再需要手动更新starCount，usePromptActions会处理

  // 使用常量而不是状态，因为目前没有更新评论的功能
  const comments = [
    {
      id: "1",
      author: {
        name: "设计师小王",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=designer"
      },
      content: "这个提示词太棒了！帮我节省了很多写PRD的时间。",
      createdAt: "2天前"
    },
    {
      id: "2",
      author: {
        name: "产品菜鸟",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=newbie"
      },
      content: "适合新手产品经理使用，文档结构非常清晰。",
      createdAt: "5天前"
    }
  ];

  const handleCopy = () => {
    if (!prompt) return;
    // 如果有变量，复制处理后的内容，否则复制原始内容
    const contentToCopy = promptVariables.length > 0 ? processedContent : prompt.content;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    toast.success("提示词已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFork = async () => {
    if (!prompt) return;

    // 将URL参数添加到导航中，以防state丢失
    const url = `/submit?fork=${prompt.id}`;

    // Navigate to submit page with the prompt data
    navigate(url, {
      state: {
        forkedPrompt: {
          title: `Copy of ${prompt.title}`,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          tags: prompt.tags || [],
          forkedFrom: prompt.id,
          example_output: prompt.example_output || ""
        }
      }
    });

    // Fork计数将在用户提交表单后更新

    toast.info("已创建提示词副本，您可以在此基础上修改后提交");
  };

  // handleToggleStar 现在由 usePromptActions 提供

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">提示词不存在或加载失败</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            无法加载所请求的提示词，它可能已被删除或您可能没有查看权限。
          </p>
          <Link to="/" className="btn-outline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回首页
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {prompt.description}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <img
                  src={prompt.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${prompt.author.name || 'user'}`}
                  alt={prompt.author.name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    // 如果图片加载失败，使用纯色背景和文字作为备用
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // 防止无限循环
                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23764abc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='35' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${(prompt.author.name?.[0] || 'U').toUpperCase()}%3C/text%3E%3C/svg%3E`;
                  }}
                />
                <div>
                  <h3 className="font-medium">{prompt.author.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {prompt.author.bio}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleToggleStar}
                    className="flex items-center text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    {isStarred ? (
                      <Star className="w-5 h-5 text-amber-400 mr-1 fill-amber-400" />
                    ) : (
                      <Star className="w-5 h-5 mr-1" />
                    )}
                    <span>{starCount}</span>
                  </button>
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center text-slate-700 dark:text-slate-300 hover:text-shumer-purple transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 mr-1" />
                    <span>{comments.length}</span>
                  </button>
                  <div className="flex items-center">
                    <GitFork className="w-5 h-5 mr-1" />
                    <span>{prompt.stats.forks}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-shumer-purple border-shumer-purple/30 hover:bg-shumer-purple/10"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "已复制" : "复制"}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-shumer-purple border-shumer-purple/30 hover:bg-shumer-purple/10"
                    onClick={handleFork}
                  >
                    <GitFork className="w-4 h-4 mr-2" />
                    Fork
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="preview" className="mt-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <Variable className="h-4 w-4" />
                    预览
                  </TabsTrigger>
                  <TabsTrigger value="use" className="flex items-center gap-1">
                    <Cpu className="h-4 w-4" />
                    使用AI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview">
                  {promptVariables.length > 0 && (
                    <div className="mb-4 p-4 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-center gap-2 mb-3 text-purple-700 dark:text-purple-300">
                        <Variable className="h-5 w-5" />
                        <h4 className="font-medium">自定义变量</h4>
                      </div>
                      <div className="grid gap-3">
                        {promptVariables.map((variable) => (
                          <div key={variable} className="grid gap-1.5">
                            <Label htmlFor={`var-${variable}`} className="text-sm text-purple-700 dark:text-purple-300">
                              {variable}
                            </Label>
                            <Input
                              id={`var-${variable}`}
                              value={variableValues[variable] || ""}
                              onChange={(e) => handleVariableChange(variable, e.target.value)}
                              placeholder={`输入 ${variable} 的值...`}
                              className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm">
                      {Object.values(variableValues).some(value => value.trim() !== "")
                        ? processedContent
                        : <div dangerouslySetInnerHTML={{ __html: highlightVariablesString(prompt.content) }} />}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="use">
                  <ModelCaller prompt={prompt.content} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" /> 评论
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <CommentForm promptId={id || ""} />
              <CommentList comments={comments} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-20">
            <PromptDerivationTree promptId={id || ""} originalAuthorId={prompt.user_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
