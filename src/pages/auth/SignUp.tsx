
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (error) throw error;

      toast.success("注册成功！请检查您的邮箱以验证账户。");
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1d1d1d] text-gray-800 dark:text-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 w-full max-w-md mx-4">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-gray-800 dark:text-white text-2xl">Create an Account</h3>
          <p className="text-sm text-gray-600 dark:text-white/70">Join GitPrompt and start exploring</p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleOAuthSignUp('google')}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-5 w-5 mr-2" fill="none">
                <g fill="none">
                  <path fill="#4285F4" d="M255.991 131.093c0-11.025-.986-21.47-2.828-31.249H130.031v59.122h71.069c-2.978 16.042-11.725 29.648-24.993 38.887l40.454 31.406c23.773-21.886 38.436-54.098 38.436-98.166Z"></path>
                  <path fill="#34A853" d="M130.031 256c32.588 0 59.986-10.797 79.982-29.293l-40.453-31.406c-11.236 7.62-25.6 12.15-39.529 12.15-30.365 0-56.088-20.521-65.282-48.084l-41.116 32.284C43.788 236.313 83.373 256 130.031 256Z"></path>
                  <path fill="#FBBC04" d="M64.749 159.367c-4.961-14.257-4.961-29.631 0-43.888L23.633 83.194C8.267 113.487 8.267 144.51 23.633 174.803l41.116-32.284Z"></path>
                  <path fill="#EA4335" d="M130.031 49.718c17.768-.277 34.458 6.644 47.356 18.887l35.433-34.552C190.166 13.628 161.109 0 130.031 0 83.373 0 43.788 19.687 23.633 83.194l41.116 32.285C73.944 70.239 99.667 49.718 130.031 49.718Z"></path>
                </g>
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleOAuthSignUp('github')}
              disabled={isLoading}
            >
              <Github className="h-5 w-5 mr-2" />
              Continue with GitHub
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1d1d1d] text-gray-500 dark:text-gray-400">Or</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <Label htmlFor="username" className="mb-1.5">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="your_username"
                    className="pl-10"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="mb-1.5">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="mb-1.5">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              Already have an account? 
              <Link to="/auth/login" className="ml-1 text-purple-600 dark:text-purple-400 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
