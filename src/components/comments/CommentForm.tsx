
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CommentFormProps {
  promptId: string;
}

const CommentForm = ({ promptId }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("请先登录后再发表评论");
      navigate("/auth/login");
      return;
    }
    
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock API call - would be replaced with actual API
      console.log("Submitting comment:", { promptId, content: comment });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("评论发布成功!");
      setComment("");
    } catch (error) {
      toast.error("评论发布失败，请重试。");
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <img 
            src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
            alt="用户头像" 
          />
        </Avatar>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="添加评论..."
          className="flex-1 resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!comment.trim() || isSubmitting}
          size="sm"
        >
          {isSubmitting ? "发布中..." : "发布评论"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
