import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  GitFork, 
  Copy, 
  MessageSquare, 
  Star, 
  StarOff,
  ArrowLeft 
} from "lucide-react";
import { toast } from "sonner";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const prompt = {
    id: id,
    title: "高效的产品需求文档生成提示词",
    description: "一个帮助快速生成高质量PRD文档的AI提示词，包含项目概述、功能需求、用户流程等完整章节。",
    content: `请帮我编写一份完整的产品需求文档 (PRD)，包含以下部分：
1. 项目概述
- 背景介绍
- 目标用户
- 核心价值主张

2. 功能需求
- 核心功能列表
- 用户界面要求
- 性能要求

3. 用户流程
- 主要用例
- 操作流程
- 异常处理

请确保文档结构清晰，重点突出，并适当添加图表说明。`,
    category: "产品经理",
    author: {
      name: "产品洞察者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=product",
      bio: "专注产品设计与用户体验"
    },
    stats: {
      rating: 4.8,
      comments: 12,
      forks: 5,
      stars: 24
    },
    tags: ["产品文档", "PRD", "需求分析"]
  };

  const [comments, setComments] = useState([
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
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("提示词已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFork = () => {
    navigate("/submit", { 
      state: { 
        forkedFrom: prompt.id,
        title: `Copy of ${prompt.title}`,
        content: prompt.content,
        category: prompt.category,
        tags: prompt.tags.join(", "),
        description: prompt.description,
      } 
    });
    toast.info("已创建提示词副本，您可以在此基础上修改后提交");
  };

  const handleToggleStar = () => {
    if (isStarred) {
      setStarCount(prev => prev - 1);
      toast.success("已取消收藏");
    } else {
      setStarCount(prev => prev + 1);
      toast.success("已添加到收藏");
    }
    setIsStarred(!isStarred);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
                src={prompt.author.avatar}
                alt={prompt.author.name}
                className="w-12 h-12 rounded-full"
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
                  <span>{starCount || prompt.stats.stars}</span>
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
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm">
                {prompt.content}
              </pre>
            </div>
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
    </div>
  );
};

export default PromptDetail;
