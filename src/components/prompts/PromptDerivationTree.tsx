
import { useState, useEffect } from "react";
import { GitBranch, GitFork } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PromptNode {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
  children?: PromptNode[];
}

interface PromptDerivationTreeProps {
  promptId: string;
  originalAuthorId?: string;
}

const PromptDerivationTree = ({ promptId, originalAuthorId }: PromptDerivationTreeProps) => {
  const [ancestors, setAncestors] = useState<PromptNode[]>([]);
  const [derivatives, setDerivatives] = useState<PromptNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ancestors");

  useEffect(() => {
    const fetchPromptRelationships = async () => {
      setIsLoading(true);

      try {
        // Fetch ancestors (prompts this one was derived from)
        await fetchAncestors(promptId);

        // Fetch derivatives (prompts derived from this one)
        await fetchDerivatives(promptId);
      } catch (error) {
        console.error('Error fetching prompt relationships:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (promptId) {
      fetchPromptRelationships();
    }
  }, [promptId]);

  const fetchAncestors = async (id: string, path: PromptNode[] = []) => {
    // Fetch current prompt
    const { data: promptData } = await supabase
      .from('prompts')
      .select(`
        id, title, user_id, created_at, fork_from
      `)
      .eq('id', id)
      .single();

    if (!promptData) return;

    // Get author information
    const { data: profileData } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', promptData.user_id)
      .single();

    const currentNode: PromptNode = {
      id: promptData.id,
      title: promptData.title,
      user_id: promptData.user_id,
      created_at: promptData.created_at,
      username: profileData?.username || 'Anonymous',
      avatar_url: profileData?.avatar_url
    };

    const updatedPath = [...path, currentNode];

    // If this prompt was forked from another, recursively fetch that one
    if (promptData.fork_from) {
      await fetchAncestors(promptData.fork_from, updatedPath);
    } else {
      // We've reached the original prompt, set the complete path
      setAncestors(updatedPath.reverse()); // Reverse to show oldest first
    }
  };

  const fetchDerivatives = async (id: string) => {
    // Get direct forks of this prompt
    const { data: forks } = await supabase
      .from('prompts')
      .select(`
        id, title, user_id, created_at
      `)
      .eq('fork_from', id);

    if (!forks || forks.length === 0) {
      setDerivatives([]);
      return;
    }

    // Get author information for each fork
    const forksWithAuthorInfo = await Promise.all(
      forks.map(async (fork) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', fork.user_id)
          .single();

        return {
          id: fork.id,
          title: fork.title,
          user_id: fork.user_id,
          created_at: fork.created_at,
          username: profile?.username || 'Anonymous',
          avatar_url: profile?.avatar_url,
        };
      })
    );

    setDerivatives(forksWithAuthorInfo);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-pulse flex space-x-3">
          <div className="h-3 w-3 bg-shumer-purple rounded-full"></div>
          <div className="h-3 w-3 bg-shumer-purple rounded-full"></div>
          <div className="h-3 w-3 bg-shumer-purple rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-4">
      <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-200">
        提示词演化树
      </h3>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="ancestors" className="flex items-center gap-2">
            <GitBranch size={16} />
            <span>源头 ({ancestors.length})</span>
          </TabsTrigger>
          <TabsTrigger value="derivatives" className="flex items-center gap-2">
            <GitFork size={16} />
            <span>派生 ({derivatives.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ancestors" className="pt-2">
          {ancestors.length > 0 ? (
            <div className="space-y-1">
              {ancestors.map((node, index) => (
                <div
                  key={node.id}
                  className={`
                    relative pl-5 py-2
                    ${index < ancestors.length - 1 ? 'border-l-2 border-slate-200 dark:border-slate-700' : ''}
                  `}
                >
                  {/* Branch connector */}
                  {index < ancestors.length - 1 && (
                    <div className="absolute top-4 left-0 w-4 h-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  )}

                  <div className={`
                    p-3 rounded-lg
                    ${promptId === node.id ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-shumer-purple/30' : 'bg-slate-50 dark:bg-slate-800/50'}
                  `}>
                    <Link to={`/prompt/${node.id}`} className="block">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={node.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${node.username || 'user'}`}
                          alt={node.username}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            // 如果图片加载失败，使用纯色背景和文字作为备用
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // 防止无限循环
                            target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23764abc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='35' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${(node.username?.[0] || 'U').toUpperCase()}%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {node.username}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(node.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        {node.title}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              这是一个原创提示词，没有源头
            </p>
          )}
        </TabsContent>

        <TabsContent value="derivatives" className="pt-2">
          {derivatives.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {derivatives.map((derivative) => (
                <AccordionItem key={derivative.id} value={derivative.id} className="border-slate-200 dark:border-slate-700">
                  <AccordionTrigger className="px-3 hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <img
                        src={derivative.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${derivative.username || 'user'}`}
                        alt={derivative.username}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          // 如果图片加载失败，使用纯色背景和文字作为备用
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // 防止无限循环
                          target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23764abc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='35' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${(derivative.username?.[0] || 'U').toUpperCase()}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {derivative.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          由 {derivative.username} 创建于 {new Date(derivative.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3">
                    <Link
                      to={`/prompt/${derivative.id}`}
                      className="text-shumer-purple hover:underline block pt-1"
                    >
                      查看此派生提示词 →
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              还没有人创建此提示词的派生版本
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptDerivationTree;
