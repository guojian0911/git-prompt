
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import PromptCard from "./PromptCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";

interface PromptListProps {
  userId: string;
  filter: 'all' | 'public' | 'private' | 'starred';
}

const PromptList = ({ userId, filter }: PromptListProps) => {
  const [page, setPage] = useState(1);
  const perPage = 6;

  const { data, isLoading } = useQuery({
    queryKey: ['prompts', userId, filter, page],
    queryFn: async () => {
      let query = supabase
        .from('prompts')
        .select(`
          *,
          profiles!prompts_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .range((page - 1) * perPage, page * perPage - 1);

      if (filter === 'starred') {
        query = supabase
          .from('starred_prompts')
          .select(`
            prompt_id,
            prompts (
              *,
              profiles!prompts_user_id_fkey (
                username,
                avatar_url
              )
            )
          `)
          .eq('user_id', userId)
          .range((page - 1) * perPage, page * perPage - 1);
      } else {
        query = query.eq('user_id', userId);
        
        if (filter === 'public') {
          query = query.eq('is_public', true);
        } else if (filter === 'private') {
          query = query.eq('is_public', false);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return filter === 'starred' 
        ? data.map((item: any) => ({
            ...item.prompts,
            author: {
              name: item.prompts.profiles?.username || 'Anonymous',
              avatar: item.prompts.profiles?.avatar_url
            }
          }))
        : data.map((prompt: any) => ({
            ...prompt,
            author: {
              name: prompt.profiles?.username || 'Anonymous',
              avatar: prompt.profiles?.avatar_url
            }
          }));
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">还没有{filter === 'starred' ? '收藏的' : ''}提示词</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((prompt) => (
          <PromptCard
            key={prompt.id}
            id={prompt.id}
            title={prompt.title}
            description={prompt.description}
            content={prompt.content}
            category={prompt.category}
            author={prompt.author}
            stats={{
              rating: 0,
              comments: 0,
              stars: prompt.stars_count,
              forks: prompt.fork_count
            }}
          />
        ))}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="cursor-pointer"
            />
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setPage(p => p + 1)}
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PromptList;
