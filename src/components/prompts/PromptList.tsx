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
      let prompts = [];

      if (filter === 'shared') {
        const { data: sharedData, error: sharedError } = await supabase
          .from('shared_prompts')
          .select(`
            id,
            prompt_id,
            shared_by,
            prompts (*)
          `)
          .eq('shared_with', userId)
          .range((page - 1) * perPage, page * perPage - 1);

        if (sharedError) throw sharedError;
        
        const userIds = sharedData.map(item => item.shared_by).filter(Boolean);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        const profilesMap = {};
        profilesData?.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
        
        prompts = sharedData.map((item) => {
          const promptData = item.prompts;
          const userProfile = profilesMap[item.shared_by];
          
          return {
            ...promptData,
            author: {
              name: userProfile?.username || 'Anonymous',
              avatar: userProfile?.avatar_url
            }
          };
        }).filter(item => item.id);
      } else {
        const { data: promptsData, error: promptsError } = await supabase
          .from('prompts')
          .select('*')
          .eq('user_id', userId)
          .range((page - 1) * perPage, page * perPage - 1);

        if (promptsError) throw promptsError;
        
        let filteredPrompts = promptsData;
        if (filter === 'public') {
          filteredPrompts = promptsData.filter(p => p.is_public);
        } else if (filter === 'private') {
          filteredPrompts = promptsData.filter(p => !p.is_public);
        }

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
              shares: prompt.share_count,
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
