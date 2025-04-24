import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AccountSettings = () => {
  const { user, profile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: user?.email || "",
        avatar: profile.avatar_url || "",
      });
    }
  }, [profile, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          avatar_url: formData.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success("个人资料更新成功！");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "更新个人资料失败");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback>
                {formData.username ? formData.username.slice(0, 2).toUpperCase() : "??"}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">个人中心</h1>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500">邮箱地址不可更改</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">头像 URL</Label>
              <Input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <Button type="submit" className="w-full">
              更新个人资料
            </Button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mt-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">账号信息</h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                登录方式：{user?.app_metadata?.provider || '邮箱'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                账号创建时间：{new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
