
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import PromptCard from "./PromptCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";

interface PromptListProps {
  userId: string;
  filter: 'all' | 'public' | 'private' | 'starred' | 'shared';
}

const PromptList = ({ userId, filter }: PromptListProps) => {
  const [page, setPage] = useState(1);
  const perPage = 6;

  const { data, isLoading } = useQuery({
    queryKey: ['prompts', userId, filter, page],
    queryFn: async () => {
      let query = supabase.from('prompts').select('*').eq('user_id', userId);

      switch (filter) {
        case 'public':
          query = query.eq('is_public', true);
          break;
        case 'private':
          query = query.eq('is_public', false);
          break;
      }

      const { data: prompts, error } = await query
        .range((page - 1) * perPage, page * perPage - 1);

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single();

      return prompts?.map(prompt => ({
        ...prompt,
        author: {
          name: profileData?.username || 'Anonymous',
          avatar: profileData?.avatar_url
        }
      })) || [];
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
        <p className="text-muted-foreground">还没有提示词</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((prompt) => (
          <PromptCard
            key={prompt.id}
            {...prompt}
            stats={{
              rating: 0,
              comments: 0,
              stars: prompt.stars_count
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
