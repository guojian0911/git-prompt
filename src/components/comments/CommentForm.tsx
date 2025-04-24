
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";

interface CommentFormProps {
  promptId: string;
}

const CommentForm = ({ promptId }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock API call - would be replaced with actual API
      console.log("Submitting comment:", { promptId, content: comment });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Comment posted successfully!");
      setComment("");
    } catch (error) {
      toast.error("Failed to post comment. Please try again.");
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
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" 
            alt="Your avatar" 
          />
        </Avatar>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!comment.trim() || isSubmitting}
          size="sm"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
