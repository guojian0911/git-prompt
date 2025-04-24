
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GitFork, Copy, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";

const PromptDetail = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  // Mock data - will be replaced with real data from backend
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
      forks: 5
    },
    tags: ["产品文档", "PRD", "需求分析"]
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("提示词已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFork = () => {
    // Fork functionality will be implemented later
    toast.info("Fork 功能即将上线");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
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

        {/* Author Card */}
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

        {/* Prompt Content Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-amber-400 mr-1" />
                  <span>{prompt.stats.rating}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-1" />
                  <span>{prompt.stats.comments}</span>
                </div>
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

        {/* Comments section - to be implemented */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">评论</h3>
          </CardHeader>
          <CardContent>
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              评论功能即将上线
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptDetail;
