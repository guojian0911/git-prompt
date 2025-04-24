
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("已成功退出登录");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "退出登录失败");
    }
  };

  // 如果正在加载认证状态，显示加载状态按钮
  if (isLoading) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon"
          disabled
        >
          <span className="animate-pulse">...</span>
        </Button>
        <Button 
          variant="outline" 
          disabled
          className="flex items-center gap-2"
        >
          <span className="animate-pulse">...</span>
        </Button>
      </>
    );
  }

  if (user) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          退出
        </Button>
      </>
    );
  }

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={() => navigate("/auth/login")}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        登录
      </Button>
      <Button 
        className="btn-primary"
        onClick={() => navigate("/auth/signup")}
      >
        注册
      </Button>
    </>
  );
};
