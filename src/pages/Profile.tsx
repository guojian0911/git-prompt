
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PromptList from "@/components/prompts/PromptList";

const Profile = () => {
  const { user, profile } = useAuth();

  const { data: userStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // 获取用户的所有提示词，包括stars_count和fork_count
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select('id, is_public, stars_count, fork_count')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching prompts:", error);
        throw error;
      }

      // 计算用户获得的总Star数
      const totalStars = prompts?.reduce((sum, prompt) => sum + (prompt.stars_count || 0), 0) || 0;

      // 计算用户提示词被Fork的总次数
      const totalForks = prompts?.reduce((sum, prompt) => sum + (prompt.fork_count || 0), 0) || 0;

      // 获取用户收藏的提示词数量
      const { count: starredCount, error: starredError } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .gt('stars_count', 0);

      if (starredError) {
        console.error("Error fetching starred prompts:", starredError);
      }

      return {
        totalPrompts: prompts?.length || 0,
        publicPrompts: prompts?.filter(p => p.is_public).length || 0,
        privatePrompts: prompts?.filter(p => !p.is_public).length || 0,
        starredPrompts: starredCount || 0,
        totalStars: totalStars,
        totalForks: totalForks
      };
    },
    enabled: !!user?.id,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* 用户信息头部 */}
        <div className="mb-8 flex items-center gap-6">
          <img
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email || 'user'}`}
            alt="用户头像"
            className="w-24 h-24 rounded-full"
            onError={(e) => {
              // 如果图片加载失败，使用纯色背景和文字作为备用
              const target = e.target as HTMLImageElement;
              target.onerror = null; // 防止无限循环
              target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23764abc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='35' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${(user.email?.[0] || 'U').toUpperCase()}%3C/text%3E%3C/svg%3E`;
            }}
          />
          <div>
            <h1 className="text-3xl font-bold">{profile?.username || user.email?.split('@')[0]}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* 统计卡片 - 新的统计信息 */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-xl font-bold">{userStats?.totalStars || 0}</span>
            <span className="text-muted-foreground">Total Upvotes</span>
          </div>

          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <line x1="6" y1="3" x2="6" y2="15"></line>
              <circle cx="18" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M18 9a9 9 0 0 1-9 9"></path>
            </svg>
            <span className="text-xl font-bold">{userStats?.totalForks || 0}</span>
            <span className="text-muted-foreground">Total Forks</span>
          </div>

          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span className="text-xl font-bold">{userStats?.totalPrompts || 0}</span>
            <span className="text-muted-foreground">Total Prompts</span>
          </div>
        </div>

        {/* 提示词选项卡 */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">全部提示词 <span className="ml-1 text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full">{userStats?.totalPrompts || 0}</span></TabsTrigger>
            <TabsTrigger value="public">公开提示词 <span className="ml-1 text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full">{userStats?.publicPrompts || 0}</span></TabsTrigger>
            <TabsTrigger value="private">私有提示词 <span className="ml-1 text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full">{userStats?.privatePrompts || 0}</span></TabsTrigger>
            <TabsTrigger value="starred">收藏提示词 <span className="ml-1 text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full">{userStats?.starredPrompts || 0}</span></TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <PromptList userId={user.id} filter="all" />
          </TabsContent>

          <TabsContent value="public" className="mt-6">
            <PromptList userId={user.id} filter="public" />
          </TabsContent>

          <TabsContent value="private" className="mt-6">
            <PromptList userId={user.id} filter="private" />
          </TabsContent>

          <TabsContent value="starred" className="mt-6">
            <PromptList userId={user.id} filter="starred" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
