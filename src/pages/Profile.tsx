
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
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select('id, is_public')
        .eq('user_id', user?.id);

      const { data: stars } = await supabase
        .from('starred_prompts')
        .select('id')
        .eq('user_id', user?.id);

      return {
        totalPrompts: prompts?.length || 0,
        publicPrompts: prompts?.filter(p => p.is_public).length || 0,
        privatePrompts: prompts?.filter(p => !p.is_public).length || 0,
        starredPrompts: stars?.length || 0,
      };
    },
    enabled: !!user?.id,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* User Info Header */}
        <div className="mb-8 flex items-center gap-6">
          <img
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
            alt="用户头像"
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold">{profile?.username || user.email?.split('@')[0]}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-2">提示词总数</h3>
            <p className="text-3xl font-bold">{userStats?.totalPrompts || 0}</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-2">公开提示词</h3>
            <p className="text-3xl font-bold">{userStats?.publicPrompts || 0}</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-2">私有提示词</h3>
            <p className="text-3xl font-bold">{userStats?.privatePrompts || 0}</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-2">收藏提示词</h3>
            <p className="text-3xl font-bold">{userStats?.starredPrompts || 0}</p>
          </Card>
        </div>

        {/* Prompts Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">全部提示词</TabsTrigger>
            <TabsTrigger value="public">公开提示词</TabsTrigger>
            <TabsTrigger value="private">私有提示词</TabsTrigger>
            <TabsTrigger value="starred">收藏提示词</TabsTrigger>
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
