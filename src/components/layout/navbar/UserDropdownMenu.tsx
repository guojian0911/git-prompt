
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, Star, LogOut, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const UserDropdownMenu = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("已成功退出登录");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "退出登录失败");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <img
            src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email || 'user'}`}
            alt="用户头像"
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              // 如果图片加载失败，使用纯色背景和文字作为备用
              const target = e.target as HTMLImageElement;
              target.onerror = null; // 防止无限循环
              target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23764abc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='35' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${(user.email?.[0] || 'U').toUpperCase()}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.username || '用户'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>个人主页</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/account")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>账户设置</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/starred")}>
          <Star className="mr-2 h-4 w-4" />
          <span>收藏的提示词</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/model-settings")}>
          <Cpu className="mr-2 h-4 w-4" />
          <span>模型设置</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
