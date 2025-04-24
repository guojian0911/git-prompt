
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePublicPrompts = () => {
  return useQuery({
    queryKey: ['featured-prompts'],
    queryFn: async () => {
      try {
        const { data: prompts, error } = await supabase
          .from('prompts')
          .select(`
            id,
            title, 
            description, 
            content,
            category,
            is_public,
            user_id,
            fork_from,
            stars_count,
            tags
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching prompts:", error);
          throw error;
        }

        // Fetch profile information for each prompt's user_id
        const promptsWithProfiles = await Promise.all(
          prompts.map(async (prompt) => {
            let username = 'Anonymous';
            let avatar_url = null;

            if (prompt.user_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', prompt.user_id)
                .single();

              if (profile) {
                username = profile.username || 'Anonymous';
                avatar_url = profile.avatar_url;
              }
            }

            return {
              ...prompt,
              author: {
                name: username,
                avatar: avatar_url
              },
              stats: {
                rating: 0,
                comments: 0,
                stars: prompt.stars_count || 0
              }
            };
          })
        );

        return promptsWithProfiles;
      } catch (error) {
        console.error("Error processing prompts:", error);
        return [];
      }
    }
  });
};
