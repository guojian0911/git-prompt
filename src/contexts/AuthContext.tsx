
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  signOut: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 同步用户信息到 profiles 表的函数
  const syncUserProfile = async (user: User) => {
    try {
      // 检查是否已存在 profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // 如果不存在 profile，创建新的
      if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.user_metadata.name || user.user_metadata.username || user.email?.split('@')[0],
            avatar_url: user.user_metadata.avatar_url,
            provider: user.app_metadata.provider,
            provider_id: user.app_metadata.provider_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return null;
        }

        return newProfile;
      }

      // 如果已存在 profile，更新信息
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          username: user.user_metadata.name || user.user_metadata.username || user.email?.split('@')[0],
          avatar_url: user.user_metadata.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return null;
      }

      return updatedProfile;
    } catch (error) {
      console.error('Sync profile error:', error);
      return null;
    }
  };

  // 确保会话状态保持同步
  useEffect(() => {
    // 首先设置监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          // 处理登出事件
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        if (newSession?.user) {
          setUser(newSession.user);
          setSession(newSession);
          
          // 使用setTimeout避免潜在的死锁
          setTimeout(async () => {
            const userProfile = await syncUserProfile(newSession.user);
            setProfile(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          setIsLoading(false);
        }
      }
    );

    // 然后检查初始会话
    const checkSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (initialSession?.user) {
          setUser(initialSession.user);
          setSession(initialSession);
          
          const userProfile = await syncUserProfile(initialSession.user);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      // 注销成功后会触发 onAuthStateChange 的 'SIGNED_OUT' 事件
      // 在那里会清除所有状态
    } catch (error) {
      console.error('Sign out error:', error);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
