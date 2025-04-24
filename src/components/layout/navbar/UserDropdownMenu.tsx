
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, Star, LogOut } from "lucide-react";
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
            src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
            alt="用户头像"
            className="w-8 h-8 rounded-full"
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
