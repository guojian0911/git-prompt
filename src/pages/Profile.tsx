
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "JohnDoe",
    email: "john@example.com",
    avatar: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    toast.success("个人资料更新成功！");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback>
                {formData.username.slice(0, 2).toUpperCase()}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">我的提示词</h2>
          {/* TODO: Add user's prompts list component */}
          <div className="text-center text-slate-600 dark:text-slate-400">
            暂无提示词
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
