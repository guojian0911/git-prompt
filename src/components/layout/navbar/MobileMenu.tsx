
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const MobileMenu = ({ isOpen, onClose, onLogout }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 py-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex flex-col space-y-4">
        <Link 
          to="/explore" 
          className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          onClick={onClose}
        >
          探索
        </Link>
        <Link 
          to="/categories" 
          className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          onClick={onClose}
        >
          分类
        </Link>
        <Link 
          to="/submit" 
          className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          onClick={onClose}
        >
          提交提示词
        </Link>
        <div className="flex flex-col space-y-2 px-4 pt-2">
          {user ? (
            <>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
              >
                <User className="h-4 w-4 mr-2" />
                个人中心
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                退出
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  navigate("/auth/login");
                  onClose();
                }}
              >
                登录
              </Button>
              <Button 
                className="btn-primary w-full"
                onClick={() => {
                  navigate("/auth/signup");
                  onClose();
                }}
              >
                注册
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
