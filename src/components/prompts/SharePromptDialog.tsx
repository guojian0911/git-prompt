
import { useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SharePromptDialogProps {
  promptId: string;
  promptTitle: string;
}

export function SharePromptDialog({ promptId, promptTitle }: SharePromptDialogProps) {
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const handleShare = async () => {
    if (!email) return;
    
    setIsSearching(true);
    try {
      // 查找要分享给的用户
      const { data: targetUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();

      if (!targetUser) {
        toast.error("找不到该用户");
        return;
      }

      // 检查是否已经分享过
      const { data: existingShare } = await supabase
        .from('shared_prompts')
        .select()
        .eq('prompt_id', promptId)
        .eq('shared_with', targetUser.id)
        .single();

      if (existingShare) {
        toast.error("已经分享给该用户了");
        return;
      }

      // 创建分享记录
      const { error } = await supabase.from('shared_prompts').insert({
        prompt_id: promptId,
        shared_by: user?.id,
        shared_with: targetUser.id
      });

      if (error) throw error;

      toast.success("分享成功");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "分享失败");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          分享提示词
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>分享提示词</DialogTitle>
          <DialogDescription>
            将 "{promptTitle}" 分享给其他用户
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              placeholder="输入用户名"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isSearching || !email}
            onClick={handleShare}
          >
            <Search className="h-4 w-4 mr-2" />
            分享
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
