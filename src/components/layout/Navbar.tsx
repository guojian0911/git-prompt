
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Moon, Sun, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // TODO: Replace with actual auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    setIsAuthenticated(false);
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">G</div>
            <span className="text-xl font-bold gradient-text">GitPrompt</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-slate-700 dark:text-slate-200 hover:text-shumer-purple dark:hover:text-shumer-purple transition-colors">
              探索
            </Link>
            <Link to="/categories" className="text-slate-700 dark:text-slate-200 hover:text-shumer-purple dark:hover:text-shumer-purple transition-colors">
              分类
            </Link>
            <Link to="/submit" className="text-slate-700 dark:text-slate-200 hover:text-shumer-purple dark:hover:text-shumer-purple transition-colors">
              提交提示词
            </Link>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>搜索提示词</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="输入关键词搜索..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {isAuthenticated ? (
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
            ) : (
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
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/explore" 
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                探索
              </Link>
              <Link 
                to="/categories" 
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                分类
              </Link>
              <Link 
                to="/submit" 
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                提交提示词
              </Link>
              <div className="flex flex-col space-y-2 px-4 pt-2">
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/profile");
                        setIsOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      个人中心
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
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
                        setIsOpen(false);
                      }}
                    >
                      登录
                    </Button>
                    <Button 
                      className="btn-primary w-full"
                      onClick={() => {
                        navigate("/auth/signup");
                        setIsOpen(false);
                      }}
                    >
                      注册
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
