
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
      let prompts = [];

      if (filter === 'starred') {
        // For starred prompts, we need a different approach
        const { data: starredData, error: starredError } = await supabase
          .from('starred_prompts')
          .select(`
            id,
            prompt_id,
            prompts (
              *
            )
          `)
          .eq('user_id', userId)
          .range((page - 1) * perPage, page * perPage - 1);

        if (starredError) throw starredError;
        
        // Get user profiles separately to avoid foreign key issues
        const userIds = starredData.map(item => item.prompts?.user_id).filter(Boolean);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        // Create a map of user_id to profile data for quick lookup
        const profilesMap = {};
        profilesData?.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
        
        prompts = starredData.map((item) => {
          const promptData = item.prompts;
          const userProfile = promptData?.user_id ? profilesMap[promptData.user_id] : null;
          
          return {
            ...promptData,
            author: {
              name: userProfile?.username || 'Anonymous',
              avatar: userProfile?.avatar_url
            }
          };
        }).filter(item => item.id); // Filter out any undefined items
      } else {
        // For regular prompts filtering
        const { data: promptsData, error: promptsError } = await supabase
          .from('prompts')
          .select('*')
          .eq('user_id', userId)
          .range((page - 1) * perPage, page * perPage - 1);

        if (promptsError) throw promptsError;
        
        // Apply filter after fetching
        let filteredPrompts = promptsData;
        if (filter === 'public') {
          filteredPrompts = promptsData.filter(p => p.is_public);
        } else if (filter === 'private') {
          filteredPrompts = promptsData.filter(p => !p.is_public);
        }

        // Get user profiles separately
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', userId)
          .single();

        prompts = filteredPrompts.map((prompt) => ({
          ...prompt,
          author: {
            name: profilesData?.username || 'Anonymous',
            avatar: profilesData?.avatar_url
          }
        }));
      }

      return prompts;
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
