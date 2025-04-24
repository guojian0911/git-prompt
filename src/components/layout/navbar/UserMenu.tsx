
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserDropdownMenu } from "./UserDropdownMenu";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <Button variant="ghost" size="icon" disabled>
          <span className="animate-pulse">...</span>
        </Button>
        <Button variant="outline" disabled className="flex items-center gap-2">
          <span className="animate-pulse">...</span>
        </Button>
      </>
    );
  }

  if (user) {
    return <UserDropdownMenu />;
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
